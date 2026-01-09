
type Ioptions={
    page ?: number | undefined,
    limit ?: number | undefined,
    sortBy ?: string,
    sortOrder ?: string
}


type IoptionsResult={
    page:number,
    limit:number,
    skip:number,
    sortBy: string,
    sortOrder:string
}

const paginationSortingHelpers = (options:Ioptions):IoptionsResult =>{
    const page:number= Number(options.page) || 1;
    const limit:number = Number(options.limit) || 10;
    const skip:number= (page -1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc'

 return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
 }

}
export default paginationSortingHelpers;