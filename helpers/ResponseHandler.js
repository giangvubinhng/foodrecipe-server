async function ResponseObject(status, message, data){

  let success = false;
  let defaultMessage;

  switch(status){
    case 200:
      success = true;
      defaultMessage = "Ok"
      break;
    case 400:
      success = false;
      defaultMessage = "Bad Request"
      break;
    case 401:
      success = false;
      defaultMessage = "Unauthorized Request"
      break;
    case 403:
      success = false;
      defaultMessage = "Forbidden"
      break;
    case 500:
      success = false;
      defaultMessage = "An internal error occurred"
      break;
  }

  message ||= defaultMessage ;

  return {
    result: {
      success,
      data,
      message
    },
    status
  }
}

module.exports = ResponseObject
