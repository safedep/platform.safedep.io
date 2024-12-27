import { NextResponse } from "next/server";

interface ProjectData {
  name: string;
  version: string;
  components: number;
  violations: number;
}

export async function GET() {
  try {
    const mockProjects: ProjectData[] = Array.from({ length: 25 }, (_, i) => ({
      name: `Project ${String.fromCharCode(65 + (i % 26))}${i >= 26 ? Math.floor(i / 26) : ""}`,
      version: "main",
      components: 100,
      violations: 200,
    }));

    return NextResponse.json(mockProjects, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch projects: ${error}` },
      { status: 500 },
    );
  }
}
