import { writable } from 'svelte/store';

export const selectedProjectId = writable<string | undefined>(undefined);
