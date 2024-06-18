import React from 'react'

const ForbiddenPage = () => {
  return (
    <>
      <div class="container py-5">
        <div class="row" style={{marginBottom:'45%'}}>
          <div class="col-md-2 text-center">
            <p><i class="fa fa-exclamation-triangle fa-5x"></i><br />Status Code: 403</p>
          </div>
          <div class="col-md-10">
            <h3>Recurso no autorizado.</h3>
            <p>El acceso a este recurso esta reservado para los administradores.<br />Regrese al sitio principal</p>
            <a class="btn btn-danger" href="/">Regresar</a>
          </div>
        </div>
      </div>

      <div id="footer" class="text-center text-decoration-underline">
        Coopepilangosta R.L
      </div>
    </>
  )
}

export default ForbiddenPage