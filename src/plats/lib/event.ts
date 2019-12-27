export interface PlatsEvent {
  type: string
  key: string
  path: string
  cwd: string
  filename: string
  ext: string
  content?: string
}