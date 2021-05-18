import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Col, Row, Input, Button} from 'antd';
import {Redirect} from 'react-router-dom';

function ScreenLogin1(props) {

  const [email, setEmail] = useState('')
  const [invalidEmailMessage, setinvalidEmailMessage] = useState('')
  const [loginState, setLoginState] = useState('')

// Fonction qui vérifie si l'email existe déjà ou pas
  var handleCheckEmail = async() => { 
  
    if (email){

  // On vérifie que l'email correspond bien à un email de type : domaine@domaine.com
      var emailReg = new RegExp(/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i);
      var valid = emailReg.test(email);
      if (!valid) {
        setinvalidEmailMessage("Veuillez entrer un email valide")
      } else {

  // Requête à la base de données
        var resultRaw = await fetch('/users/check-email', {
          method: 'POST',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body: `email=${email}`
        });
        var resultCheckEmail = await resultRaw.json();

  // Changement de l'état login en fonction de la réponse ce qui permettra de faire des redirections
        if (resultCheckEmail.response == 'login2') {
          props.saveEmail(email)
          setLoginState('login2')
        } else if (resultCheckEmail.response == 'signUpCollab'){
          props.saveEmail(email)
          setLoginState('sign-up-collab')
        } else {
          props.saveEmail(email)
          setLoginState('sign-up-manager')
        }
      } 
    } else {
      setinvalidEmailMessage('Veuillez rentrer un email')
    }
  } 

  if (loginState == 'login2') {
    return (<Redirect to='/login2'/>)
  } else if (loginState == 'sign-up-collab'){
    return (<Redirect to='/sign-up-collab'/>)
  } else if (loginState == 'sign-up-manager'){
    return(<Redirect to='/sign-up-manager'/>) 
  } else {
      return (
      <div className="background">
        <Row justify="center" align="middle" style={{height:'100%'}}>
          <Col span={14} style={{height:'70%', backgroundColor:'white', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <img width={200} src={'./logo-transparent.png'}/>
            <div style={{marginTop: '20px'}}>
              <div style={{color:'red'}}>
                {invalidEmailMessage}
              </div>
              <Input style={{borderRadius: '5px', width:'18rem', marginRight:'4px'}} placeholder="Votre email" onChange={(e) => setEmail(e.target.value)} value={email}/>
              <Button style={{borderRadius: '5px'}} onClick={() => handleCheckEmail()}>
                Valider
              </Button>
            </div>
            <div style={{height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
              <div style={{fontStyle: 'italic'}}>Hey Listen, l'application pour les managers VRAIMENT bienveillants !</div>
            </div>
            <div style={{height: '20%', display: 'flex', alignItems: 'flex-end'}}>
            powered by <img style={{height: '20%', display: 'flex', alignItems: 'flex-end'}} width={100} src={"./uptoo.svg"}/>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveEmail: function(email) {
      dispatch( {type: 'saveEmail', email: email} )
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ScreenLogin1);