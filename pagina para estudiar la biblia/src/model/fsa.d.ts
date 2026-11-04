/**
 * Ampliación de tipos para la File System Access API.
 * TypeScript 5.9 incluye FileSystemFileHandle pero no el picker ni los permisos.
 */
export {};

declare global {
  interface SvFilePickerAcceptType {
    description?: string;
    accept: Record<string, readonly string[]>;
  }

  interface SvOpenFilePickerOptions {
    multiple?: boolean;
    excludeAcceptAllOption?: boolean;
    types?: readonly SvFilePickerAcceptType[];
    id?: string;
  }

  interface FileSystemHandlePermissionDescriptor {
    mode?: 'read' | 'readwrite';
  }

  interface FileSystemHandle {
    queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
    requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
  }

  interface DataTransferItem {
    getAsFileSystemHandle?(): Promise<FileSystemHandle | null>;
  }

  interface Window {
    showOpenFilePicker(options?: SvOpenFilePickerOptions): Promise<FileSystemFileHandle[]>;
  }
}
