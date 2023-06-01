export const formatFileStatus = (status: string) => {
	switch (status) {
		case "public":
			return "Public";
		case "public-encrypted":
			return "Restricted";
		case "private":
			return "Private";
		default:
			return "Private";
	}
};
