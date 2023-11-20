import { gql } from '@apollo/client/core';

export const projectsQueryName = 'Projects';
export const projectsQuery = gql`
	query ${projectsQueryName} {
		projects {
			edges {
				node {
					id
					name
				}
			}
		}
	}
`;

export const serviceFields = `
	fragment ServiceFields on Service {
		id
		name
		icon
		createdAt
		projectId
		serviceInstances {
			edges {
				node {
					...ServiceInstanceFields
				}
			}
		}
		deployments {
			edges {
				node {
					...DeploymentFields
				}
			}
		}
	}

	fragment ServiceInstanceFields on ServiceInstance {
		id
		source {
			repo
			image
		}
		serviceId
		environmentId
	}

	fragment DeploymentFields on Deployment {
		id
		status
		createdAt
		projectId
		serviceId
		environmentId
	}
`;

export const projectInfoQueryName = 'ProjectInfo';
export const projectInfoQuery = gql`
	query ${projectInfoQueryName}($id: String!) {
		project(id: $id) {
			...ProjectFields
		}
	}

	fragment ProjectFields on Project {
		id
		name
		description
		createdAt

		environments {
			edges {
				node {
					...EnvironmentFields
				}
			}
		}
		services {
			edges {
				node {
					...ServiceFields
				}
			}
		}
		volumes {
			edges {
				node {
					...VolumeFields
				}
			}
		}
	}

	fragment EnvironmentFields on Environment {
		id
		name
		createdAt
		projectId
	}

	${serviceFields}

	fragment VolumeFields on Volume {
		id
		createdAt
		name
		projectId
		volumeInstances {
			edges {
				node {
					...VolumeInstanceFields
				}
			}
		}
	}

	fragment VolumeInstanceFields on VolumeInstance {
		id
		createdAt
		volumeId
		environmentId
		serviceId
		mountPath
		sizeMB
		currentSizeMB
		region
		state
	}
`;

export const createServiceMutationName = 'serviceCreate';

export const createServiceMutation = gql`
	mutation ${createServiceMutationName}($input: ServiceCreateInput!) {
		serviceCreate(input: $input) {
			...ServiceFields
		}
	}

	${serviceFields}
`;

export const deleteServiceMutationName = 'DeleteService';
export const deleteServiceMutation = gql`
	mutation ${deleteServiceMutationName}($id: String!) {
		serviceDelete(id: $id)
	}
`;

export const deleteVolumeMutationName = 'DeleteVolume';
export const deleteVolumeMutation = gql`
	mutation ${deleteVolumeMutationName}($id: String!) {
		volumeDelete(volumeId: $id)
	}
`;
