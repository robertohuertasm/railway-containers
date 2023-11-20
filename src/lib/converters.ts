import {
	deploymentStatusList,
	type Deployment,
	type Environment,
	type Project,
	type ProjectInfo,
	type Service,
	type ServiceInstance,
	type Volume
} from './models';

type ProjectsPayload = {
	data:
		| {
				projects: {
					edges: {
						node: Project;
					}[];
				};
		  }
		| undefined;
};

type EnvironmentsPayload = {
	edges: {
		node: {
			id: string;
			name: string;
			createdAt: string;
			projectId: string;
		};
	}[];
};

type ServiceInstancePayload = {
	edges: {
		node: {
			id: string;
			source:
				| {
						repo: string | undefined;
						image: string | undefined;
				  }
				| undefined;
			serviceId: string;
			environmentId: string;
		};
	}[];
};

type DeploymentPayload = {
	edges: {
		node: {
			id: string;
			status: string;
			createdAt: string;
			environmentId: string;
			projectId: string;
			serviceId: string;
		};
	}[];
};

export type CreateServiceResponse = {
	data: { serviceCreate: ServicePayload } | undefined;
};

type ServicePayload = {
	id: string;
	name: string;
	icon: string | undefined;
	createdAt: string;
	projectId: string;
	serviceInstances: ServiceInstancePayload;
	deployments: DeploymentPayload;
};

type ServicesPayload = {
	edges: {
		node: ServicePayload;
	}[];
};

type VolumeInstancePayload = {
	edges: {
		node: {
			id: string;
			createAt: string;
			volumeId: string;
			environmentId: string;
			serviceId: string;
			mountPath: string;
			sizeMB: number;
			currentSizeMB: number;
			region: string;
			state: string;
		};
	}[];
};

type VolumesPayload = {
	edges: {
		node: {
			id: string;
			name: string;
			createdAt: string;
			projectId: string;
			volumeInstances: VolumeInstancePayload;
		};
	}[];
};

export type ProjectInfoPayload = {
	data:
		| {
				project: {
					id: string;
					name: string;
					description: string;
					createdAt: string;
					environments: EnvironmentsPayload | undefined;
					services: ServicesPayload | undefined;
					volumes: VolumesPayload | undefined;
				};
		  }
		| undefined;
};

function toDate(date: string): Date {
	return new Date(date);
}

function toEnvironments(payload: EnvironmentsPayload | undefined): Environment[] {
	if (!payload) return [];
	return payload.edges.map((e) => ({
		id: e.node.id,
		name: e.node.name,
		createdAt: toDate(e.node.createdAt),
		projectId: e.node.projectId
	}));
}

function toServiceInstances(payload: ServiceInstancePayload | undefined): ServiceInstance[] {
	if (!payload) return [];
	return payload.edges.map((e) => ({
		id: e.node.id,
		repo: e.node.source?.repo,
		image: e.node.source?.image,
		environmentId: e.node.environmentId,
		serviceId: e.node.serviceId
	}));
}

function toDeploymentStatus(status: string): Deployment['status'] {
	const casted = status as Deployment['status'];
	return deploymentStatusList.includes(casted) ? casted : 'UNKNOWN';
}

function toDeployments(payload: DeploymentPayload | undefined): Deployment[] {
	if (!payload) return [];
	return payload.edges.map((e) => ({
		id: e.node.id,
		status: toDeploymentStatus(e.node.status),
		createdAt: toDate(e.node.createdAt),
		environmentId: e.node.environmentId,
		projectId: e.node.projectId,
		serviceId: e.node.serviceId
	}));
}

function toServices(payload: ServicesPayload | undefined): Service[] {
	if (!payload) return [];
	const result = payload.edges.map((e) => toService(e.node)).filter((s) => !!s);
	// we filtered the undefined values so this is safe.
	return result as Service[];
}

function toVolumeInstances(payload: VolumeInstancePayload | undefined): Volume['volumeInstances'] {
	if (!payload) return [];
	return payload.edges.map((e) => ({
		id: e.node.id,
		createdAt: toDate(e.node.createAt),
		volumeId: e.node.volumeId,
		environmentId: e.node.environmentId,
		serviceId: e.node.serviceId,
		mountPath: e.node.mountPath,
		sizeMB: e.node.sizeMB,
		currentSizeMB: e.node.currentSizeMB,
		region: e.node.region,
		state: e.node.state
	}));
}

function toVolumes(payload: VolumesPayload | undefined): Volume[] {
	if (!payload) return [];

	return payload.edges.map((e) => ({
		id: e.node.id,
		name: e.node.name,
		createdAt: toDate(e.node.createdAt),
		projectId: e.node.projectId,
		volumeInstances: toVolumeInstances(e.node.volumeInstances)
	}));
}

export function toProjects(payload: unknown): Project[] | undefined {
	if (!payload) return undefined;
	const projectsPayload = payload as ProjectsPayload;

	if (!projectsPayload.data) return undefined;
	return projectsPayload.data.projects.edges.map((e) => e.node);
}

export function toProjectInfo(payload: unknown): ProjectInfo | undefined {
	if (!payload) return undefined;
	const infoPayload = payload as ProjectInfoPayload;

	if (
		!infoPayload.data ||
		!infoPayload.data.project.environments ||
		!infoPayload.data.project.services ||
		!infoPayload.data.project.volumes
	)
		return undefined;

	const project: ProjectInfo = {
		id: infoPayload.data.project.id,
		name: infoPayload.data.project.name,
		description: infoPayload.data.project.description,
		createdAt: toDate(infoPayload.data.project.createdAt),
		environments: toEnvironments(infoPayload.data.project.environments),
		services: toServices(infoPayload.data.project.services),
		volumes: toVolumes(infoPayload.data.project.volumes)
	};

	return project;
}

export function toService(payload: unknown): Service | undefined {
	if (!payload) return undefined;
	const servicePayload = payload as ServicePayload;

	const service = {
		id: servicePayload.id,
		name: servicePayload.name,
		icon: servicePayload.icon,
		createdAt: toDate(servicePayload.createdAt),
		projectId: servicePayload.projectId,
		instances: toServiceInstances(servicePayload.serviceInstances),
		deployments: toDeployments(servicePayload.deployments),
		isBeingDeleted: false
	};

	return service;
}
