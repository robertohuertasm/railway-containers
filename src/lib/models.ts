export interface Project {
	id: string;
	name: string;
}

export interface Environment {
	id: string;
	name: string;
	createdAt: Date;
	projectId: string;
}

export interface VolumeInstance {
	id: string;
	mountPath: string;
	sizeMB: number;
	currentSizeMB: number;
	region: string;
	state: string;
	createdAt: Date;
	environmentId: string;
	serviceId: string;
	volumeId: string;
}

export interface Volume {
	id: string;
	name: string;
	createdAt: Date;
	projectId: string;
	volumeInstances: VolumeInstance[];
}

export interface ServiceInstance {
	id: string;
	repo: string | undefined;
	image: string | undefined;
	environmentId: string;
	serviceId: string;
}

export const deploymentStatusList = <const>[
	'BUILDING',
	'CRASHED',
	'DEPLOYING',
	'FAILED',
	'INITIALIZING',
	'QUEUED',
	'REMOVED',
	'REMOVING',
	'SKIPPED',
	'SUCCESS',
	'WAITING',
	'UNKNOWN'
];

export interface Deployment {
	id: string;
	status: (typeof deploymentStatusList)[number];
	createdAt: Date;
	environmentId: string;
	projectId: string;
	serviceId: string;
}

export interface Service {
	id: string;
	name: string;
	icon: string | undefined;
	createdAt: Date;
	projectId: string;
	instances: ServiceInstance[];
	deployments: Deployment[];
	isBeingDeleted: boolean;
}

export interface ProjectInfo {
	id: string;
	name: string;
	createdAt: Date;
	description: string | undefined;
	environments: Environment[];
	services: Service[];
	volumes: Volume[];
}
