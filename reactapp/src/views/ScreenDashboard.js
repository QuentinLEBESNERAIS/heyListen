import React,{useState,useEffect} from 'react';
import '../App.css';
import {Button,Row,Col,Progress,Input,Form,List,Avatar,Tag,Typography,Modal,Image, message, Popconfirm,Popover} from 'antd'
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined, DeleteOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom'
import Nav from './Nav'
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import { filter } from 'lodash';

function ScreenDashboard(props) {
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [visible4, setVisible4] = useState(false);
    const[feedbackOne,setFeedbackOne] = useState('');
    const[feedbackTwo,setFeedbackTwo] = useState('');
    const [collabEmail,setCollabEmail] = useState ('');
    const [errorMessage, setErrorMessage] = useState('');
    const [team,setTeam] = useState([]);
    const[listenfromBack,setListenfromBack] = useState([]);
    const [feedbackfromBack,setFeedbackFromBack] = useState([])
    const [collabIDFeedback,setCollabIDFeedback] = useState('')
    const [search,setSearch] = useState('')
    const [filterdedTeam,setFilteredTeam] = useState([])

useEffect(()=> {
        console.log('test id manager',props.userId._id)
          var getBddCollab = async () => {
          var rawResponse = await fetch(`/users/find-collab?manager=${props.userId._id}`);
          var collabs = await rawResponse.json();
          setTeam(collabs.collabs)
          setFilteredTeam(collabs.collabs)
          setListenfromBack(collabs.collabsListen)
          setFeedbackFromBack(collabs.collabFeedback)
         }
         if(props.userId.type == 'manager'){getBddCollab()}
         console.log('test',team,listenfromBack,feedbackfromBack)
         
          },[])
// Recherche collab
useEffect(()=> {
    const results = team.filter(person =>
        person.firstName.toLowerCase().includes(search.toLocaleLowerCase())
      );
    setFilteredTeam(results)
  },[search])

// Paramètres modale feedback manager
    const showModal1 = () => {
        setVisible1(true);
    };
    
    const handleOk1 =  () => {
       
        var saveFeedback = async () => {
            await fetch('/save-feedback', {
                method: 'PUT',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `id=${collabIDFeedback}&feedback1=${feedbackOne}&feedback2=${feedbackTwo}`
            });
            
        }
        saveFeedback();
        setVisible1(false);
        var getBddCollab = async () => {
            var rawResponse = await fetch(`/users/find-collab?manager=${props.userId._id}`);
            var collabs = await rawResponse.json();
            setTeam(collabs.collabs)
            setListenfromBack(collabs.collabsListen)
            setFeedbackFromBack(collabs.collabFeedback)
           }
           if(props.userId.type == 'manager'){getBddCollab()}
    };

    const handleCancel1 = () => {
        setVisible1(false);
    };

// Paramètres modale ajout de collab
    const showModal2 = () => {
        setVisible2(true);
    };
    
    const handleOk2 = async () => {
        if (collabEmail) {
            var emailReg = new RegExp(/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i);
            var valid = emailReg.test(collabEmail);
            if(!valid){
                setErrorMessage("Veuillez entrer un email valide")
            } else {
                var saveCollab = async () => {
                    var responseRaw = await fetch('/users/add-collab', {
                        method: 'POST',
                        headers: {'Content-Type':'application/x-www-form-urlencoded'},
                        body: `collabEmail=${collabEmail}&userId=${props.userId._id}`
                    });
                    var response = await responseRaw.json();
                    console.log('response', response)
                    const info = () => {
                        message.info(response.response);
                      }
                      info();
                } 
                await saveCollab()
                setVisible2(false);
            }
        }
    };

    const handleCancel2 = () => {
        setVisible2(false);
    };

// NEW CAMPAIGN
    var newCampaignLaunch = async () => {
        const data = await fetch('/new-campaign', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `idFromFront=${props.userId._id}`
        })
        const info = () => {
            message.info('Nouvelle campagne lancée avec succés !');
        }
        info();
        const body = await data.json()
    }

    function confirm() {
        newCampaignLaunch()
      }

      const handleDelete = () => {
        setVisible3(true);
        ;
    };

    const handleCancelDelete = () => {
        setVisible3(false);
        ;
    };
    
    const suppressionCollab = () => {
        
        ;
    };
// Charts
    const state = {
        labels: ['January', 'February', 'March',
                 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Humeur',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            fill: true,
            lineTension: 0.4,
            data: [3, 5, 4, 1, 3, 2],
          }
        ]
      }

    //Initiales avatar liste collab
    var firstMaj = (a) =>{
        return ( 
            (a+'').charAt(0).toUpperCase()
            );
    }
//changement couleur Tab collab
var tabGlobalListen = []
for(var i=0; i<listenfromBack.length;i++){
   var color
   var text
   var iconDisplayEye 
    if(listenfromBack[i] === false){
        color = 'red'
        text = "Ce collaborateur n'a pas rempli son Listen"
    }else if (listenfromBack[i] === true){

        color = 'green'
        text = "Ce collaborateur a rempli son Listen"
    }
   
    tabGlobalListen.push(<Tag color={color}
    style={{borderRadius:'10px',width:300,textAlign:'center'}}>
        {text}
    </Tag>)
}
//changement couleur et icon cadena/edit Tab collab
var tabGlobalFeedback = []
var iconStyle = []
var iconStyleCadena =[]
for(var i=0; i<feedbackfromBack.length;i++){
    var colorFeedback
    var textFeedback
    var iconDisplay
    var iconDisplayCadena
     if(feedbackfromBack[i] === false){
        colorFeedback = 'red'
        textFeedback = "Vous n'avez pas rempli votre partie"
        iconDisplay = { fontSize: '24px' }
        iconDisplayCadena = { fontSize: '24px',display:'none' }
    
     }else{
        colorFeedback = 'green'
        textFeedback = "Vous avez rempli votre partie"
        iconDisplay = { fontSize: '24px',display:'none' }
        iconDisplayCadena = { fontSize: '24px' }
     }
    
     tabGlobalFeedback.push(<Tag color={colorFeedback}
     style={{borderRadius:'10px',width:300,textAlign:'center'}}>
         {textFeedback}
     </Tag>)
     iconStyle.push(iconDisplay)
     iconStyleCadena.push(iconDisplayCadena)
}
//changement icon oeil
var iconStyleEye =[]
for (var i=0; i<listenfromBack.length;i++){
    var iconDisplayEye  
    if (listenfromBack[i]===true && feedbackfromBack[i]===true){
         iconDisplayEye = { fontSize: '24px'}
    }else{
        iconDisplayEye = { fontSize: '24px', display:'none' }
    }
    iconStyleEye.push(iconDisplayEye)
    console.log( iconStyleEye)
    
    }

// Taux de complétion 
var listenCompleted = 0
for (var i=0; i<listenfromBack.length;i++){ 
    if (listenfromBack[i]===true){
        listenCompleted += 1
    }
}

var completion = (listenCompleted / listenfromBack.length) * 100
console.log('completion',completion)

const showModal4 = () => {
    setVisible4(true);
};

const handleOk4 =  () => {
    setVisible4(false);
}

const handleCancel4 = () => {
    setVisible4(false);
};

    if(props.userId.type==="manager"){
    return (
        <div>
            <Nav/>
            <Row style={{height:65}}>
                <Col span={8} offset={1}>
                    <h4 style={{marginTop:20}}>Taux de complétion :        
                    <Progress percent={completion} size="small" status="active" />
                    </h4> 
                </Col>
            </Row>
            <Row >
            <Col span={22} offset={1} height={50}>
              <Line 
              height={50}
               data={state}
               options={{

                 title:{
                   display:false,
                 },
                 legend:{
                   display:true,
                 },
                 plugins:{
                     legend:{
                         display:false
                     }
               }}}>
               </Line>

            </Col>
            </Row>
            <Row style={{marginTop:20}}>
                <Col span={8} offset={2}>
                    <h4 style={{paddingRight:8}}>
                        <SendOutlined style={{color:'#3d84b8', paddingRight:5}}/>
                        Envoyer un rappel
                    </h4>
                </Col>
                <Col span={6} offset={6}>
                    <Form>
                        <Form.Item label="Rechercher:" style={{fontWeight:'500'}} >
                            <Input onChange={(e) => setSearch(e.target.value)} placeholder="Collaborateur" style={{ width: 200 }} />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col span={22} offset={1}>
                    <List itemLayout="horizontal">
                    {filterdedTeam.map((item,i) => (
                        <div key={i}>
                        <List.Item actions={[<a key="delete"><Button type="link" onClick={()=> handleDelete() }><DeleteOutlined/></Button></a>]} style={{border:'1px solid black',padding:10,margin:5}}>
                            <Avatar style={{ backgroundColor:'#3d84b8', verticalAlign: 'middle' }} 
                            size="large">
                            {firstMaj(item.firstName)}{firstMaj(item.lastName)}
                            </Avatar>
                            <Typography.Text>{item.firstName} {item.lastName}</Typography.Text>
                            <div>
                            {tabGlobalListen[i]}
                            {tabGlobalFeedback[i]}
                            </div>
                            <HistoryOutlined style={{ fontSize: '24px' }}/>
                            <div>
                                <EyeOutlined style={iconStyleEye[i]} onClick={() => {showModal4()}}
                                />
                                <LockOutlined style={iconStyleCadena[i]}/>
                                <EditOutlined onClick={() => {showModal1(); setCollabIDFeedback(item._id)}} style={iconStyle[i]}/>
                            </div>
                        </List.Item>
                        <Modal visible={visible1} onCancel={handleCancel1} footer={null}>
                <Form layout="vertical" >
                    <h2 className='input-listen'> 
                        {<Image width='30px' src="./logo-transparent.png" />}
                        Concernant Michel Dupont :
                    </h2>
                    <Form.Item label="Qu'avez vous pensez de la performance de Michel ?" 
                    className='input-listen' >
                        <Input onChange={(e) => setFeedbackOne(e.target.value)}
                        value={feedbackOne}/>
                    </Form.Item>
                    <Form.Item label="Qu'attendez vous de Michel pour le mois prochain ?" 
                    className='input-listen'>
                        <Input onChange={(e) => setFeedbackTwo(e.target.value)}
                        value={feedbackTwo}/>
                    </Form.Item>
                    <Form.Item layout="horizontal" style={{marginTop:30}}>
                            <Button key="back" htmlType="submit" 
                            style={{backgroundColor:'grey',color:'white',marginLeft:240}}
                            onClick={handleCancel1}>
                                Annuler
                            </Button>
                            <Button key="submit" 
                            style={{backgroundColor:'#3d84b8',color:'white',marginLeft:20}}
                            onClick={()=> handleOk1() }>
                            Valider
                            </Button>
                    </Form.Item>
                </Form>
            </Modal>
                        </div>
                    ))}
                    </List>  
                </Col>
            </Row> 
            <Row style={{marginTop:20}}>
              <Popover content={'Le collaborateur sera ajouté à la liste, dès le lancement de la prochaine campagne de listens'}>
                <Col onClick={showModal2} span={8} offset={2}>
                <Button onClick={showModal2} type="primary" icon={<UserAddOutlined />}>
                Ajouter un collaborateur
                </Button>
                </Col>
                </Popover>
                <Col span={6} offset={8} >
                <Popconfirm
                    placement="topRight"
                    title="Attention : Tous les Listen non complétés seront archivés"
                    onConfirm={confirm}
                    okText="Je lance une nouvelle campagne"
                    cancelText="No"
                    >
                    <Button>Lancer une nouvelle campagne Listen</Button>
                </Popconfirm>
                </Col>
                
            </Row>

            

            <Modal visible={visible2} onCancel={handleCancel2} footer={null} width={700} height={500}>
                <div style={{color:'red', display:'flex', justifyContent:'center'}}>
                    {errorMessage}
                </div>
                <Form layout="inline" >
                    <h2 className='input-listen'> 
                        {<Image width='30px' src="./logo-transparent.png" />}
                        Collaborateur à ajouter :
                    </h2>
                    <Form.Item layout="horizontal" style={{marginTop:30,padding:0}}>
                        <Input placeholder='Email du collaborateur'
                        onChange={(e) => setCollabEmail(e.target.value)}
                        value={collabEmail}/>
                    </Form.Item>
                    <Form.Item layout="horizontal" style={{marginTop:30}}>
                            <Button key="back" htmlType="submit" 
                            style={{backgroundColor:'grey',color:'white',marginLeft:335}}
                            onClick={handleCancel2}>
                                Annuler
                            </Button>
                            <Button key="submit" 
                            style={{backgroundColor:'#3d84b8',color:'white',marginLeft:20}}
                            onClick={()=> handleOk2()}>
                                Ajouter ce collaborateur
                            </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="Suppression" visible={visible3} onCancel={handleCancelDelete} footer={<Link to="/dashboard"> <Button type="link" key="delete" onClick={suppressionCollab()}>
              Confirmer
            </Button></Link>}>
        <p>Souhaitez-vous supprimez définitivement ce collaborateur de votre équipe ?</p>
      </Modal>
      <Modal title="Visionage du listen" visible={visible4} onCancel={handleCancel4} onOk={handleOk4}>
            <h3>Votre feedback</h3>
            <h4>Feedback 1:</h4>
            <p></p>
            <h4>Feedback 2:</h4>
            <p></p>
            <h3>Son Listen</h3>
            <h4>Humeur:</h4>
            <p></p>
            <h4>Reponse 1:</h4>
            <p></p>
            <h4>Reponse 2:</h4>
            <p></p>
            <h4>Reponse 3:</h4>
            <p></p>
            <h4>Reponse 4:</h4>
            <p></p>
            <h4>Reponse 5:</h4>
            <p></p>
      </Modal>
        </div>
    )}
    else {return <Redirect to='/historique-collab'/> };
}

function mapStateToProps(state) {
    
    return { userId: state.user }
}

export default connect(
    mapStateToProps,
    null
)(ScreenDashboard);