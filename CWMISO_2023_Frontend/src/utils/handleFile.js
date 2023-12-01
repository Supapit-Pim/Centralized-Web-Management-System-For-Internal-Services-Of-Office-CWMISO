const useHandleFile = {
  async readURLFile(event) {
    const file = event.target.files[0]
    let namefile, base64String, dataFile
    if (file) {
      const maxSizeInBytes = 4 * 1024 * 1024
      if (file.size <= maxSizeInBytes) {
        namefile = file.name
        base64String = await this.readFileAsBase64(file)
        dataFile = URL.createObjectURL(file)
      } else {
        alert('File size > 4 MB')
        namefile = null
      }
      return { namefile, base64String, dataFile }
    }
  },
  async readFileAsBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.readAsDataURL(file)
    })
  }
}

export default useHandleFile
