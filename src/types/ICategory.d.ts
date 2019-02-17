export default interface ICategory {
    id?: string; 
    title: string;
    description: string;
    color: string; 
    [index : string] : string;
}