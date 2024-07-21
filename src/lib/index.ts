// place files you want to import through the `$lib` alias in this folder.
export {default as catchHelper} from './catchHelper';

export interface CustomError extends Error {
	body?: {
		message: string;
	}
}