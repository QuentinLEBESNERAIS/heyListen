import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Card, Col, Input, Row, Button,message, Divider} from 'antd';
import {Link,Redirect} from 'react-router-dom';
import information from '../information.svg'
import information2 from '../information2.svg'

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
    if (firstName && lastName && password && password2 && company && jobTitle){
      console.log('helllo', firstName, lastName, password, password2)
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

// Styles background selon type
  var backgroundStyle = {background: 'linear-gradient(180deg, #007DB3, #005295 50%, #003376)', height:'100vh', minHeight: '100vh'}
  var image = <img src={information} width={400}/>
  var buttonStyle = {marginLeft:'15px', borderColor:'#003566', color:'#003566',borderRadius:10,filter:'drop-shadow(1px 1px 1px #003566)'}
  if (props.user.type == 'collab'){
    backgroundStyle = {background: 'linear-gradient(180deg, #FFFFFF, #00BFA6 90%, #00a38d)', height:'100vh', minHeight: '100vh'}
    image =  <img src={information2} width={400}/>
    buttonStyle = {marginLeft:'15px', borderColor:'#84CD98', color:'#84CD98',borderRadius:10,filter:'drop-shadow(1px 1px 1px #84CD98)'}
  } 
// Une fois le user modifié, l'utilisateur est renvoyé vers le dashboard
  if(userModified){
    return <Redirect to="/dashboard"/>
  }
  return (
    <div style={backgroundStyle}>
      <Row>
        <Col span={20} offset={2} style={{marginTop:70,filter:'drop-shadow(1px 2px 5px #555555)'}}>
          <Card style={{borderRadius:20}}>
            <Row justify="center" align="top">
              <Col span={9}>
                {image}
              </Col>
              <Col span={14}offset={1}>
                <h2 style={{margin:0}}>Changer mes informations personnelles</h2>
                <Divider/>
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
                <Link to='/dashboard'><Button style={{marginTop:'30px',marginLeft:'420px',borderColor:'grey', color:'grey',borderRadius:10,filter:'drop-shadow(1px 1px 1px grey)'}}>Retour</Button></Link>
                <Button onClick={()=>handleClickModifInfos()} style={buttonStyle}>Modifier</Button>
              </Col>
            </Row>
          </Card>
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