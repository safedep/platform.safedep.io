"use cache";

export async function getReport(reportId: string) {
  // sleep for 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: reportId,
    name: "Test Report",
    description: "This is a test report",
  };
}
