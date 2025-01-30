import * as fs from 'fs';

export class SqlReader {
  constructor() {}
  /**
   * Fn to parse sql instructions  from a string
   * @param sqlString sql instructions string from file or plain string
   * @returns array of each sql instruction (query)
   */
  static parseSqlString = (sqlString: string): string[] => {
    return (
      sqlString
        // skip sql comments like(--comments)
        .replace(/(--)(.*)/g, '')
        // replace new line
        .replace(/\r?\n|\r/g, ' ')
        // skip sql comments like (*/ comments */)
        .replace(/\/\*.*\*\//g, ' ')
        // replace multiple spaces
        .replace(/\s\s+/g, ' ')
        .split(';')
        .map((query) => query.trim())
        .filter((query) => query?.length)
    );
  };

  /**
   * Fn to read sql instruction from an sql file
   * @param filepath path of the sql file
   * @returns array of sql instructions
   */
  static readSqlFile = (filepath: string): string[] => {
    const sqlString = fs.readFileSync(filepath).toString();
    return SqlReader.parseSqlString(sqlString);
  };

  /**
   * Fn to read sql instruction from an sql file and execute them
   * with the runnerFn
   * @param filepath path of the sql file
   * @returns void
   */
  static runSqlFile = (filepath: string, runnerFn: (query: string) => void) => {
    const queries = SqlReader.readSqlFile(filepath);

    for (const query of queries) {
      runnerFn(query);
    }
  };

  /**
   * Fn to read sql instruction from an sql file and execute them
   * with the runnerFn
   * @param filepath path of the sql file
   * @returns Promise<void>
   */
  static runSqlFileAsync = async (
    filepath: string,
    runnerFn: (query: string) => Promise<any>,
  ): Promise<any> => {
    const queries = SqlReader.readSqlFile(filepath);

    for (const query of queries) {
      await runnerFn(query);
    }
  };
}
