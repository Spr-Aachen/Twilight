declare global {
	interface Window {
		translate?: {
			service: {
				use: (service: string) => void;
			};
			language: {
				setLocal: (language: string) => void;
			};
			setAutoDiscriminateLocalLanguage: () => void;
			ignore: {
				class: string[];
				tag: string[];
			};
			selectLanguageTag: {
				show: boolean;
			};
			storage: {
				set: () => void;
			};
			listener: {
				start: () => void;
			};
			execute: () => void;
		};
		loadTranslateScript?: () => Promise<void>;
		translateScriptLoaded?: boolean;
		translateInitialized?: boolean;
	}
}

export {};