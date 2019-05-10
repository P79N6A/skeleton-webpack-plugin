/*
** outDir-The path to output the skeletoned page html
** projectDir-The path of your project root directory
** port-The port of Page skeleton webpack plugin
** defer-Defer to generate skeleton page
** cssUnit-The css unit used in skeletoned page html
** color-The skeleton block background-color
*/

export default interface IOptions {
    outDir: string;
    projectDir: string;
    port?: number;
    defer?: number;
    cssUnit?: string;
    color?: string;
    plugins?: Array<Function>
}