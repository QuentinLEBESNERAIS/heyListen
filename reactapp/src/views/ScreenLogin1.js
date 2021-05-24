import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Card,Col, Row, Input, Button} from 'antd';
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
          
          <Col span={4} style={{height:'70%', backgroundColor:'#eeeeee',borderRadius:'20px 0 0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <img width={120} src={'./logo-transparent.png'}/>
            <div style={{height: '20%', display: 'flex', alignItems: 'flex-end'}}>
            <p>powered by <img  width={55} src={"./uptoo.svg"}/></p>
            </div>
            </Col>
            <Col span={10} style={{filter:'drop-shadow(-15px 0px 15px -3px #bbbbbb)',height:'70%', backgroundColor:'white',borderRadius:'0 20px 20px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{marginTop: '20px'}}>
              
            <p style={{marginLeft:70, marginBottom:40,fontSize:'40px',color:'#0065A2'}}>Hey Listen !</p>
            
              <div style={{color:'red'}}>
                {invalidEmailMessage}
              </div>
              
              <Input style={{borderRadius: '5px',borderColor:'#0065A2', width:'18rem', marginRight:'4px'}} placeholder="Votre email" onChange={(e) => setEmail(e.target.value)} value={email}/>
              <Button style={{filter:'drop-shadow(5px 5px 15px 5px #0065A2)',marginLeft:5,marginTop:10,borderColor:'#0065A2', color:'#0065A2',borderRadius:10}} onClick={() => handleCheckEmail()}>
                Valider
              </Button>
            </div>
            <div style={{height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
              <div style={{fontStyle: 'italic'}}>L'application pour les managers VRAIMENT bienveillants !</div>
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