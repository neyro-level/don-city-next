const projectLiteral = /donetsk|Донецк|ДНР|ДОН СИТИ|doncity/iu;
const projectImport =
	/(?:from|import\s*)\s*\(?["'][^"']*(?:@\/|\.\.\/|src\/)project\//u;

export function findPlatformBoundaryViolations(files) {
	const violations = [];
	for (const file of files) {
		if (projectLiteral.test(file.content)) {
			violations.push(`${file.name}: project literal inside Platform`);
		}
		if (projectImport.test(file.content)) {
			violations.push(`${file.name}: Platform must not import Project`);
		}
	}
	return violations;
}
