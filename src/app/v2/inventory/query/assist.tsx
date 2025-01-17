interface Props {
  setQueryFn?: (query: string) => void;
}

interface ExampleQuery {
  label: string;
  query: string;
}

const exampleQueries: ExampleQuery[] = [
  {
    label: "Find all projects",
    query: `SELECT projects.name, projects.version from projects WHERE projects.version = 'main'`,
  },
  {
    label: "Find all components",
    query: `SELECT projects.name, projects.version, packages.name, packages.version FROM projects WHERE projects.version = 'main'`,
  },
  {
    label: "Find components with critical vulnerabilities",
    query: `SELECT projects.name, projects.version, packages.name, packages.version,
  vulnerabilities.cve_id, vulnerabilities.summary
FROM projects
  WHERE
vulnerabilities.risk = 'CRITICAL'
      `,
  },
  {
    label: "Filter vulnerable components by EPSS",
    query: `SELECT projects.name, projects.version, packages.name, packages.version,
  vulnerabilities.cve_id, vulnerabilities.summary
FROM projects WHERE vulnerabilities.epss > 0.5`,
  },
  {
    label: "Find unpopular components",
    query: `SELECT projects.name, projects.version, packages.name, packages.version,
  open_source_projects.name, open_source_projects.homepage, open_source_projects.stars
FROM projects WHERE open_source_projects.stars < 10`,
  },
];

export const QueryAssist = ({ setQueryFn }: Props) => {
  return (
    <div className="flex flex-col gap-4 p-1 pt-2 pl-4 border-l border-gray-200">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Query Assist
      </h4>
      <div className="text-sm">
        <p>
          Execute SQL-like queries to find information from your organizational
          inventory. Get start with example queries below.
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          {exampleQueries.map((example) => (
            <li
              key={example.label}
              className="cursor-pointer text-blue-800 hover:text-blue-500"
              onClick={() => setQueryFn?.(example.query)}
            >
              {example.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
