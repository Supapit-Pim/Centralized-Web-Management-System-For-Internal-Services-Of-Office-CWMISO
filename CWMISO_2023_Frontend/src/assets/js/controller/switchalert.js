import Swal from 'sweetalert2'
import '../../css/switchalet.css'

const SwitchAlert = {
  success(title) {
    Swal.fire({
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1500
    })
  },
  error(title) {
    Swal.fire({
      icon: 'error',
      title: title,
      showConfirmButton: true,
      timer: 1500
    })
  },
  warning(title) {
    Swal.fire({
      icon: 'warning',
      title: title,
      showConfirmButton: true,
      // timer: 1500
    })
  },
  info(title) {
    Swal.fire({
      icon: 'info',
      title: title,
      showConfirmButton: false,
      timer: 1500
    })
  },
  question(title) {
    Swal.fire({
      icon: 'question',
      title: title,
      showConfirmButton: false,
      timer: 1500
    })
  },
  Delete(title, html, data, res) {
    Swal.fire({
      icon: 'warning',
      title: title,
      html: html,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',

      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง',
      
      // customClass: {
      //   popup: 'my-sweetalert-popup'
      // }
    }).then((result) => {
      res([result,data])
    })
  },
  loading(title, timer) {
    Swal.fire({
      title: title,
      // html: 'I will close in milliseconds.',
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        // const b = Swal.getHtmlContainer().querySelector('b')
        // timerInterval = setInterval(() => {
        //   b.textContent = Swal.getTimerLeft()
        // }, 100)
      }
      // willClose: () => {
      //   clearInterval(timerInterval)
      // }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  },
  sw_loading() {
    Swal.fire({
      html: `<div class="loader">
                  <div class="flex justify-center my-10">
                    <img src="https://chiangraientersoft.com/loading.gif">
                </div>
                </div>
                              `,
      showConfirmButton: false,
      allowOutsideClick: false,
    });
  }
}

export default SwitchAlert
