import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Col, Input, Row, Alert, Space, Button,message} from 'antd';
import {Link,Redirect} from 'react-router-dom';

function ScreenInfosPersonnelles(props) {

  const [firstName,setFirstName] = useState(props.user.firstName)
  const [lastName,setLastName] = useState(props.user.lastName)
  const [password,setPassword] = useState("")
  const [password2,setPassword2] = useState("")
  const [company,setCompany] = useState(props.user.company)
  const [jobTitle,setJobTitle] = useState(props.user.jobTitle)
  const [messageError,setMessageError] = useState("")
  const [userModified, setUserModified] = useState(false)

// Fonction qui se déclenche lors de l'appui sur le bouton modifier
  var handleClickModifInfos = ()=> {
    // On vérifie que tous les champs sont remplis
    if (firstName, lastName, password, password2, company, jobTitle){

    // On vérifie que le mot de passe respecte les standards de sécurité
    var passwordReg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i);
    var valid = passwordReg.test(password);

    // On vérifie que les 2 champs password sont identiques
    if(password != password2){ setMessageError('Les mots de passe ne correspondent pas')
    } else if (!valid) {
        setMessageError("Le mot de passe doit contenir au minimum 8 caractères dont une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial")
    } else {
    // si toutes les conditions sont remplies, on envoie une requête au backend pour modifier les informations personnelles
      async function userChanges(){
        var response = await fetch('/users/modification-infos',{
          method:"POST",
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:`token=${props.user.token}&email=${props.email}&firstName=${firstName}&lastName=${lastName}&password=${password}&password2=${password2}&company=${company}&jobTitle=${jobTitle}`
        })
        response = await response.json()

    // Le user est également enregistré dans le store
        props.userToReducer(response.user)
        if(response.response==='Informations modifiées'){
    
    // Un message de validation de l'enregistrement est affiché
            setUserModified(true)
          const info = () => {
            message.info(response.response);
          }
          info();}
      }
      userChanges()
    }
    } else {
        setMessageError('Merci de remplir tous les champs')
    }
    }
// Une fois le user modifié, l'utilisateur est renvoyé vers le dashboard
  if(userModified){
    return <Redirect to="/dashboard"/>
  }
  return (
    <div className="background">

      <Row justify="center" align="middle">
        <Col span={16} align="middle" className="sign-up-title" style={{paddingTop:'2rem'}}>
          Changer mes informations personnelles :
        </Col>
      </Row>
      <Row justify="center" align="top">
        <Col span={16}>
          <div style={{color:'red'}}>
            {messageError}
          </div>
          <div className="sign-up-input-group"> 
            <Input value={lastName} onChange={(e)=>setLastName(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Nom" />
            <Input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Prénom" />
          </div>
          <div className="sign-up-input-group"> 
            <Input.Password value={password} onChange={(e)=>setPassword(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Mot de passe" />
            <Input.Password value={password2} onChange={(e)=>setPassword2(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Confirmation du mot de passe" />
          </div>
          <div>
            <Input value={company} onChange={(e)=>setCompany(e.target.value)} className="sign-up-inputs sign-up-bottom-input-width" placeholder="Entreprise" />
          </div>
          <div>
            <Input value={jobTitle} onChange={(e)=>setJobTitle(e.target.value)} className="sign-up-inputs sign-up-bottom-input-width" placeholder="Intitulé du poste" />
          </div>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={16} className="sign-up-button-div">
          <Link to='/dashboard'><Button className="sign-up-button">Retour</Button></Link>
          <Button style={{marginLeft:'4px'}} onClick={()=>handleClickModifInfos()} className="sign-up-button">Modifier</Button>
        </Col>
      </Row>
    </div>
  );
}

function mapDispatchToProps(dispatch){
  return {
    userToReducer: function(user){
      dispatch({type:"logUser", user})
    }
  }
}

function mapStateToProps(state){
  return {user:state.user}
}

export default connect(mapStateToProps,mapDispatchToProps)(ScreenInfosPersonnelles)