/**
 * Copyright (c) 2016, Daniel Imms (MIT License).
 * Copyright (c) 2018, Microsoft Corporation (MIT License).
 */

export interface IProcessEnv {
  [key: string]: string | undefined
}

// export interface ITerminal {
//   /**
//    * Gets the name of the process.
//    */
//   process: string

//   /**
//    * Gets the process ID.
//    */
//   pid: number

//   /**
//    * Writes data to the socket.
//    * @param data The data to write.
//    */
//   write (data: string): void

//   /**
//    * Resize the pty.
//    * @param cols The number of columns.
//    * @param rows The number of rows.
//    */
//   resize (cols: number, rows: number): void

//   /**
//    * Clears the pty's internal representation of its buffer. This is a no-op
//    * unless on Windows/ConPTY.
//    */
//   clear (): void

//   /**
//    * Close, kill and destroy the socket.
//    */
//   destroy (): void

//   /**
//    * Kill the pty.
//    * @param signal The signal to send, by default this is SIGHUP. This is not
//    * supported on Windows.
//    */
//   kill (signal?: string): void

//   /**
//    * Set the pty socket encoding.
//    */
//   setEncoding (encoding: string | null): void

//   /**
//    * Resume the pty socket.
//    */
//   resume (): void

//   /**
//    * Pause the pty socket.
//    */
//   pause (): void

//   /**
//    * Alias for ITerminal.on(eventName, listener).
//    */
//   addListener (eventName: string, listener: (...args: any[]) => any): void

//   /**
//    * Adds the listener function to the end of the listeners array for the event
//    * named eventName.
//    * @param eventName The event name.
//    * @param listener The callback function
//    */
//   on (eventName: string, listener: (...args: any[]) => any): void

//   /**
//    * Returns a copy of the array of listeners for the event named eventName.
//    */
//   listeners (eventName: string): Function[]

//   /**
//    * Removes the specified listener from the listener array for the event named
//    * eventName.
//    */
//   removeListener (eventName: string, listener: (...args: any[]) => any): void

//   /**
//    * Removes all listeners, or those of the specified eventName.
//    */
//   removeAllListeners (eventName: string): void

//   /**
//    * Adds a one time listener function for the event named eventName. The next
//    * time eventName is triggered, this listener is removed and then invoked.
//    */
//   once (eventName: string, listener: (...args: any[]) => any): void

//   /**
//    * The column size in characters.
//    */
//   readonly cols: number

//   /**
//    * The row size in characters.
//    */
//   readonly rows: number

//   /**
//    * (EXPERIMENTAL)
//    * Whether to handle flow control. Useful to disable/re-enable flow control during runtime.
//    * Use this for binary data that is likely to contain the `flowControlPause` string by accident.
//    */
//   handleFlowControl: boolean

//   /**
//    * Adds an event listener for when a data event fires. This happens when data is returned from
//    * the pty.
//    * @returns an `IDisposable` to stop listening.
//    */
//   readonly onData: IEvent<string>

//   /**
//    * Adds an event listener for when an exit event fires. This happens when the pty exits.
//    * @returns an `IDisposable` to stop listening.
//    */
//   readonly onExit: IEvent<{ exitCode: number, signal?: number }>

//   /**
//    * Resizes the dimensions of the pty.
//    * @param columns The number of columns to use.
//    * @param rows The number of rows to use.
//    */
//   resize (columns: number, rows: number): void

//   // Re-added this interface as homebridge-config-ui-x leverages it https://github.com/microsoft/node-pty/issues/282

//   /**
//   * Adds a listener to the data event, fired when data is returned from the pty.
//   * @param event The name of the event.
//   * @param listener The callback function.
//   * @deprecated Use IPty.onData
//   */
//   on (event: 'data', listener: (data: string) => void): void

//   /**
//    * Adds a listener to the exit event, fired when the pty exits.
//    * @param event The name of the event.
//    * @param listener The callback function, exitCode is the exit code of the process and signal is
//    * the signal that triggered the exit. signal is not supported on Windows.
//    * @deprecated Use IPty.onExit
//    */
//   on (event: 'exit', listener: (exitCode: number, signal?: number) => void): void

//   /**
//    * Clears the pty's internal representation of its buffer. This is a no-op
//    * unless on Windows/ConPTY. This is useful if the buffer is cleared on the
//    * frontend in order to synchronize state with the backend to avoid ConPTY
//    * possibly reprinting the screen.
//    */
//   clear (): void

//   /**
//    * Writes data to the pty.
//    * @param data The data to write.
//    */
//   write (data: string): void

//   /**
//    * Kills the pty.
//    * @param signal The signal to use, defaults to SIGHUP. This parameter is not supported on
//    * Windows.
//    * @throws Will throw when signal is used on Windows.
//    */
//   kill (signal?: string): void

//   /**
//    * Pauses the pty for customizable flow control.
//    */
//   pause (): void

//   /**
//    * Resumes the pty for customizable flow control.
//    */
//   resume (): void
// }

interface IBasePtyForkOptions {
  name?: string
  cols?: number
  rows?: number
  cwd?: string
  env?: IProcessEnv
  encoding?: string | null
  handleFlowControl?: boolean
  flowControlPause?: string
  flowControlResume?: string
}

export interface IPtyForkOptions extends IBasePtyForkOptions {
  uid?: number
  gid?: number
}

export interface IWindowsPtyForkOptions extends IBasePtyForkOptions {
  useConpty?: boolean
  useConptyDll?: boolean
  conptyInheritCursor?: boolean
}

export interface IPtyOpenOptions {
  cols?: number
  rows?: number
  encoding?: string | null
}
