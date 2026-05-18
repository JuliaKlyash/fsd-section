/** @type {import('jest').Config} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.jest.json"
			}
		]
	},
	roots: ["<rootDir>/src"],
	testMatch: ["**/*.test.ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^@app/(.*)$": "<rootDir>/src/app/$1",
		"^@pages/(.*)$": "<rootDir>/src/pages/$1",
		"^@widgets/(.*)$": "<rootDir>/src/widgets/$1",
		"^@features/(.*)$": "<rootDir>/src/features/$1",
		"^@entities/(.*)$": "<rootDir>/src/entities/$1",
		"^@shared/(.*)$": "<rootDir>/src/shared/$1"
	}
};
