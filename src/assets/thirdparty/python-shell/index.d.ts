/// <reference types="node" />
import { EventEmitter } from 'events';
import { ChildProcess, SpawnOptions } from 'child_process';
import { Readable, Writable } from 'stream';
export interface Options extends SpawnOptions {
  mode?: 'text' | 'json' | 'binary';
  formatter?: (param: string) => any;
  parser?: (param: string) => any;
  stderrParser?: (param: string) => any;
  encoding?: string;
  pythonPath?: string;
  /**
   * see https://docs.python.org/3.7/using/cmdline.html
   */
  pythonOptions?: string[];
  /**
   * overrides scriptPath passed into PythonShell constructor
   */
  scriptPath?: string;
  /**
   * arguments to your program
   */
  args?: string[];
}
export declare class PythonShellError extends Error {
  traceback: string | Buffer;
  exitCode?: number;
}
/**
 * An interactive Python shell exchanging data through stdio
 * @param {string} script    The python script to execute
 * @param {object} [options] The launch options (also passed to child_process.spawn)
 * @constructor
 */
export declare class PythonShell extends EventEmitter {
  scriptPath: string;
  command: string[];
  mode: string;
  formatter: (param: string | Object) => any;
  parser: (param: string) => any;
  stderrParser: (param: string) => any;
  terminated: boolean;
  childProcess: ChildProcess;
  stdin: Writable;
  stdout: Readable;
  stderr: Readable;
  exitSignal: string;
  exitCode: number;
  private stderrHasEnded;
  private stdoutHasEnded;
  private _remaining;
  private _endCallback;
  static defaultPythonPath: string;
  static defaultOptions: Options;
  /**
   * spawns a python process
   * @param scriptPath path to script. Relative to current directory or options.scriptFolder if specified
   * @param options
   */
  constructor(scriptPath: string, options?: Options);
  static format: {
    text: (data: any) => string;
    json: (data: any) => string;
  };
  static parse: {
    text: (data: any) => string;
    json: (data: string) => any;
  };
  /**
   * checks syntax without executing code
   * @param {string} code
   * @returns {Promise} rejects w/ stderr if syntax failure
   */
  static checkSyntax(code: string): Promise<{}>;
  static getPythonPath(): string;
  /**
   * checks syntax without executing code
   * @param {string} filePath
   * @returns {Promise} rejects w/ stderr if syntax failure
   */
  static checkSyntaxFile(filePath: string): Promise<string>;
  /**
   * Runs a Python script and returns collected messages
   * @param  {string}   scriptPath   The path to the script to execute
   * @param  {Options}   options  The execution options
   * @param  {Function} callback The callback function to invoke with the script results
   * @return {PythonShell}       The PythonShell instance
   */
  static run(
    scriptPath: string,
    options?: Options,
    callback?: (err?: PythonShellError, output?: any[]) => any
  ): PythonShell;
  /**
   * Runs the inputted string of python code and returns collected messages. DO NOT ALLOW UNTRUSTED USER INPUT HERE!
   * @param  {string}   code   The python code to execute
   * @param  {Options}   options  The execution options
   * @param  {Function} callback The callback function to invoke with the script results
   * @return {PythonShell}       The PythonShell instance
   */
  static runString(
    code: string,
    options?: Options,
    callback?: (err: PythonShellError, output?: any[]) => any
  ): PythonShell;
  static getVersion(
    pythonPath?: string
  ): Promise<{
    stdout: string;
    stderr: string;
  }>;
  static getVersionSync(pythonPath?: string): string;
  /**
   * Parses an error thrown from the Python process through stderr
   * @param  {string|Buffer} data The stderr contents to parse
   * @return {Error} The parsed error with extended stack trace when traceback is available
   */
  private parseError;
  /**
   * Sends a message to the Python shell through stdin
   * Override this method to format data to be sent to the Python process
   * @param {string|Object} data The message to send
   * @returns {PythonShell} The same instance for chaining calls
   */
  send(message: string | Object): this;
  /**
   * Parses data received from the Python shell stdout stream and emits "message" events
   * This method is not used in binary mode
   * Override this method to parse incoming data from the Python process into messages
   * @param {string|Buffer} data The data to parse into messages
   */
  receive(data: string | Buffer): this;
  /**
   * Parses data received from the Python shell stderr stream and emits "stderr" events
   * This method is not used in binary mode
   * Override this method to parse incoming logs from the Python process into messages
   * @param {string|Buffer} data The data to parse into messages
   */
  receiveStderr(data: string | Buffer): this;
  private receiveInternal;
  /**
   * Closes the stdin stream, which should cause the process to finish its work and close
   * @returns {PythonShell} The same instance for chaining calls
   */
  end(callback: (err: PythonShellError, exitCode: number, exitSignal: string) => any): this;
  /**
   * Closes the stdin stream, which should cause the process to finish its work and close
   * @returns {PythonShell} The same instance for chaining calls
   */
  terminate(signal?: string): this;
}
