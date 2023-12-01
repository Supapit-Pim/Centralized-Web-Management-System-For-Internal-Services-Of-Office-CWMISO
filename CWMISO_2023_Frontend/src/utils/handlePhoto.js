const useHandlePhoto = {
  async readURL(event) {
    const file = event.target.files[0]
    let namephoto, base64String, photoImage
    if (file) {
      const maxSizeInBytes = 4 * 1024 * 1024
      if (file.size <= maxSizeInBytes) {
        namephoto = file.name
        base64String = await this.readFileAsBase64(file)
        photoImage = URL.createObjectURL(file)
      } else {
        alert('File size > 4 MB')
        namephoto = null
      }
      return { namephoto, base64String, photoImage }
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

export default useHandlePhoto
