import {
	toProjectInfo,
	toProjects,
	type ProjectInfoPayload,
	toService,
	type CreateServiceResponse
} from './converters';
import {
	ApolloClient,
	type DocumentNode,
	InMemoryCache,
	type NormalizedCacheObject
} from '@apollo/client/core';
import type { Project, ProjectInfo, Service } from './models';
import { writable, type Unsubscriber } from 'svelte/store';
import {
	createServiceMutation,
	deleteServiceMutation,
	deleteVolumeMutation,
	projectInfoQuery,
	projectsQuery
} from './queries';

export type Converter<T> = (payload: unknown) => T;
// NOTE: we're using a CORS proxy to avoid CORS issues
const RAILWAY_URI = `https://corsproxy.io/?https://backboard.railway.app/graphql/v2`;

export class Api {
	private readonly apollo: ApolloClient<NormalizedCacheObject>;
	public token = writable<string | undefined>(undefined);
	private tokenSubs: Unsubscriber;

	constructor() {
		this.apollo = new ApolloClient({ uri: RAILWAY_URI, cache: new InMemoryCache() });
		this.tokenSubs = this.token.subscribe((token) => {
			if (token) {
				localStorage.setItem('token', token.trim());
			} else {
				localStorage.removeItem('token');
			}
		});
		const token = localStorage.getItem('token') ?? undefined;
		this.token.set(token);
	}

	public cache() {
		return this.apollo.cache;
	}

	public dispose() {
		this.tokenSubs?.();
	}

	private async query<T>(
		query: DocumentNode,
		converter: Converter<T>,
		force: boolean,
		variables?: Record<string, unknown>
	): Promise<T | undefined> {
		if (!this.token) return undefined;
		try {
			const result: unknown = await this.apollo.query({
				query,
				context: {
					headers: {
						authorization: `Bearer ${localStorage.getItem('token')}`
					}
				},
				fetchPolicy: force ? 'network-only' : undefined,
				variables
			});
			return converter(result);
		} catch (error) {
			console.error(error);
		}
		return undefined;
	}

	public async getProjects(force = false): Promise<Project[] | undefined> {
		return this.query(projectsQuery, toProjects, force);
	}

	public async getInfoByProjectId(
		projectId: string,
		force = false
	): Promise<ProjectInfo | undefined> {
		return this.query(projectInfoQuery, toProjectInfo, force, { id: projectId });
	}

	private async mutate<T>(
		mutation: DocumentNode,
		converter: Converter<T>,
		variables?: Record<string, unknown>
	): Promise<T | undefined> {
		if (!this.token) return undefined;
		try {
			const result: unknown = await this.apollo.mutate({
				mutation,
				context: {
					headers: {
						authorization: `Bearer ${localStorage.getItem('token')}`
					}
				},
				variables
			});
			return converter(result);
		} catch (error) {
			console.error(error);
		}
		return undefined;
	}

	public async createContainer(projectId: string, image: string): Promise<Service | undefined> {
		const result = await this.mutate(createServiceMutation, (x) => x as CreateServiceResponse, {
			input: { projectId, source: { image } }
		});

		if (result && result.data) {
			// modify the apollo cache
			const data = this.apollo.readQuery<ProjectInfoPayload['data']>({
				query: projectInfoQuery,
				variables: { id: projectId }
			});
			if (data) {
				const services = data.project.services?.edges;
				// if no deployments, create a fake one in pending state
				if (!result.data.serviceCreate.deployments.edges.length) {
					const fakeNow = new Date();
					fakeNow.setSeconds(fakeNow.getSeconds() + 20);
					result.data.serviceCreate.deployments.edges.push({
						node: {
							id: fakeNow.getTime().toString(),
							status: 'DEPLOYING',
							createdAt: fakeNow.toISOString(),
							projectId,
							serviceId: result.data.serviceCreate.id,
							environmentId: data.project.environments?.edges[0]?.node.id ?? 'production',
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							__typename: 'Deployment'
						}
					});
				}
				if (services) {
					services.push({ node: result.data.serviceCreate });
					data.project.services!.edges = services;
					this.apollo.writeQuery({
						query: projectInfoQuery,
						data: { project: data.project }
					});
				}
			}
		}

		return toService(result?.data?.serviceCreate);
	}

	public async deleteService(serviceId: string, projectId?: string): Promise<boolean> {
		const result = await this.mutate(
			deleteServiceMutation,
			(result) => {
				return (result as DeleteServiceResult).data?.serviceDelete ?? false;
			},
			{ id: serviceId }
		);

		if (!result) {
			return false;
		}

		if (projectId) {
			// modify the apollo cache if we have projectId information
			//NOTE:  OPINIONATED: for this demo, we will always delete the volumes if available
			const data = this.apollo.readQuery<ProjectInfoPayload['data']>({
				query: projectInfoQuery,
				variables: { id: projectId }
			});
			if (data) {
				// TODO: (ROB) we will assume 1 volume although this may not be correct, but for the demos's sake it's fine.
				const volumeToDelete = data.project.volumes?.edges.find((v) =>
					v.node.volumeInstances.edges.some((i) => i.node.serviceId === serviceId)
				);

				let newVolumes = data.project.volumes?.edges;

				if (volumeToDelete) {
					const volumeDeleteResult = await this.deleteVolume(volumeToDelete.node.id);
					if (volumeDeleteResult) {
						newVolumes = newVolumes?.filter((v) => v.node.id !== volumeToDelete.node.id);
					}
				}

				const services = data.project.services?.edges.filter((e) => e.node.id !== serviceId);
				if (services) {
					data.project.services!.edges = services;
					if (newVolumes) {
						data.project.volumes!.edges = newVolumes;
					}
					this.apollo.writeQuery({
						query: projectInfoQuery,
						data: { project: data.project }
					});
				}
			}
		}

		return result;
	}

	public async deleteVolume(volumeId: string): Promise<boolean> {
		const result = await this.mutate(
			deleteVolumeMutation,
			(result) => {
				return (result as DeleteVolumeResult).data?.volumeDelete ?? false;
			},
			{ id: volumeId }
		);
		return !!result;
	}
}

type DeleteServiceResult = { data: { serviceDelete: boolean } | undefined };
type DeleteVolumeResult = { data: { volumeDelete: boolean } | undefined };
