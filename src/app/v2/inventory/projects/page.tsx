import listProjects from "./actions";

export default async function Page() {
  const projects = await listProjects();

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return <div>num projects = {projects?.projects.length}</div>;
}
