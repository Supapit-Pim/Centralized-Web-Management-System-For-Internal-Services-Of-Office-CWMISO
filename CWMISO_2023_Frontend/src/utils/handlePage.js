const useHandlePage = {
    total_pages(arrry, itemsPerPage) {
        return Math.ceil(arrry / itemsPerPage); // 31/10
    },
    getdata_pages(currentPage, itemsPerPage) {
        const startIndex = (currentPage - 1) * itemsPerPage; // 0 / 10
        const endIndex = startIndex + itemsPerPage; // 10 / 20
        return [startIndex, endIndex]
    },
}

export default useHandlePage