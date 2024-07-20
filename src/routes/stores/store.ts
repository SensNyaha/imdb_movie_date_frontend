import {writable} from 'svelte/store';

export const loggedUserToken = writable<string | null>(null);