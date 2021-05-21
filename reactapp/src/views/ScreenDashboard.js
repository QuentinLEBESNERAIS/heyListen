import React,{useState,useEffect} from 'react';
import '../App.css';
import {Button,Row,Col,Progress,Input,Form,List,Avatar,Tag,Typography,Modal,Image, message, Popconfirm,Popover} from 'antd'
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined, DeleteOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom'
import Nav from './Nav'
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';

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
    const [idCollab, setIdCollab] = useState('')
    const [search,setSearch] = useState('')
    const [filteredTeam, setFilteredTeam] = useState([])
    const [pageLoaded, setPageLoaded] = useState(false)
    const [seeListen,setSeeListen] = useState({reponse1: "", reponse2: "", reponse3: "", reponse4: "", reponse5: ""})
    const [seeFeedback,setSeeFeedback] = useState({feedback1: "", feedback2: ""})
    const [seeMood,setSeeMood] = useState(0)
    const [isNewCampaign, setIsNewCampaign] = useState(false)
    const [stats,setStats] = useState([{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1}])

//Affichage collab 
useEffect(()=> {
  var getBddCollab = async () => {
  var rawResponse = await fetch(`/users/find-collab?manager=${props.userId._id}`);
  var collabs = await rawResponse.json();
  setTeam(collabs.collabs)
  setFilteredTeam(collabs.collabs)
  setListenfromBack(collabs.collabsListen)
  setFeedbackFromBack(collabs.collabFeedback)
}

var handleStatsRoute = async () =>{
    var response = await fetch(`/get-stats?manager=${props.userId._id}`);
    var statsListen = await response.json();
    console.log('oooooo',statsListen.statsMood.length)
    if(statsListen.statsMood.length < 6 ){
        console.log('ezetzetez');
        setStats([{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1}])
    }else{
        console.log('aaaaaaaaaaaaaaa');
        setStats(statsListen.statsMood)
    }
    setPageLoaded(true)
}
 if(props.userId.type == 'manager'){getBddCollab();handleStatsRoute();console.log('stats',stats)}
  },[])

  console.log('stats',stats)
  useEffect(()=> {
    var getBddCollab = async () => {
    var rawResponse = await fetch(`/users/find-collab?manager=${props.userId._id}`);
    var collabs = await rawResponse.json();
    setTeam(collabs.collabs)
    setFilteredTeam(collabs.collabs)
    setListenfromBack(collabs.collabsListen)
    setFeedbackFromBack(collabs.collabFeedback)
    setPageLoaded(true)
  }
  var handleStatsRoute = async () =>{
    var response = await fetch(`/get-stats?manager=${props.userId._id}`);
    var statsListen = await response.json();
    console.log(statsListen)
    if(statsListen.statsMood.length < 6 ){
        console.log('ezetzetez');
        setStats([{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1}])
    }else{
        console.log('aaaaaaaaaaaaaaa');
        setStats(statsListen.statsMood)
    }
}
   if(props.userId.type == 'manager'){getBddCollab();handleStatsRoute()}
    },[isNewCampaign])

// Recherche collab
    useEffect(()=> {
        const results = team.filter(person => person.firstName.toLowerCase().includes(search.toLocaleLowerCase()));
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
                    const info = () => {
                        message.info(response.response);
                    }
                    info();
                    console.log('response.newManagerTeam', response.newManagerTeam)
                    setFilteredTeam(response.newManagerTeam)

                    setListenfromBack(response.collabsListen)
                    setFeedbackFromBack(response.collabFeedback)
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
        setIsNewCampaign(true)
    }

    function confirm() {
        setIsNewCampaign(false)
        newCampaignLaunch()
    }

    //FONCTION POUR RELANCER TOUS LES COLLAB 
    const relaunch = async () => {
        const rawRelaunchData = await fetch('/mail/relaunch', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `idFromFront=${props.userId._id}`
        }) 
        let relaunchData = await rawRelaunchData.json()
        const info = () => {
            message.info('Vos collaborateurs ont été relancé');
        }
        if(relaunchData==="relancé"){info()}

    }
    // Fonctions pour suppression d'un collab 

    const handleDelete = (idCollabToDelete) => {
        setVisible3(true);
        setIdCollab(idCollabToDelete);
    };

    const handleCancelDelete = () => {
        setVisible3(false);
    };

    const suppressionCollab = async () => {
        
        var suppCollab = async () => {
            var managerTeam = await fetch('users/delete-collab', {
                method: 'PUT',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `idCollab=${idCollab}&idManager=${props.userId._id}`
            });
            var team = await managerTeam.json()
            setFilteredTeam(team.newManagerTeam)
            
        } 
        suppCollab();
        setVisible3(false);

    };

// Charts
    const state = {
        labels: ['Decembre', 'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai'],
        datasets: [
            {label: 'Humeur', backgroundColor: 'rgba(75,192,192,0.4)', borderColor: 'rgba(75,192,192,1)', borderWidth: 2, fill: true, lineTension: 0.4, data: [2, 3, 3, 4, 5, 3]}
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
        tabGlobalListen.push(
            <Tag color={color} style={{borderRadius:'10px',width:300,textAlign:'center'}}>
                {text}
            </Tag>
        )
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
        tabGlobalFeedback.push(
            <Tag color={colorFeedback} style={{borderRadius:'10px',width:300,textAlign:'center'}}>
                {textFeedback}
            </Tag>
        )
        iconStyle.push(iconDisplay)
        iconStyleCadena.push(iconDisplayCadena)
    }

//changement icon oeil
    var iconStyleEye =[]
    for (var i=0; i<listenfromBack.length;i++){
        var iconDisplayEye  
        if (listenfromBack[i]===true && feedbackfromBack[i]===true){
            iconDisplayEye = { fontSize: '24px'}
        } else {
            iconDisplayEye = { fontSize: '24px', display:'none' }
        }
        iconStyleEye.push(iconDisplayEye)
    }

// Taux de complétion 
    var listenCompleted = 0
    for (var i=0; i<listenfromBack.length;i++){ 
        if (listenfromBack[i]===true){
            listenCompleted += 1
        }
    }

    var completion = (listenCompleted / listenfromBack.length) * 100

    const showModal4 = () => {
       
        setVisible4(true);
    };

    var getSeeListen = async (value) => {
        var Response = await fetch(`/see-listen?collab=${value}`);
        var listens = await Response.json();
        setSeeListen(listens.answers)
        setSeeFeedback(listens.feedbacks)
        setSeeMood(listens.listenCompleted.mood)
    }
    
    

    const handleOk4 =  () => {
        setVisible4(false);
    }

    const handleCancel4 = () => {
        setVisible4(false);
    };

   
    
    
    
      if(props.userId.type==="manager"){
        if (pageLoaded){
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
                    <Button onClick={relaunch}  icon={<SendOutlined />}>
                    Relancer tous les collabs
                    </Button>
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
                        {filteredTeam.map((item,i) => (
                            <div key={i}>
                            <List.Item actions={[<a key="delete"><Button type="link" onClick={()=> handleDelete(item._id) }><DeleteOutlined/></Button></a>]} style={{border:'1px solid black',padding:10,margin:5}}>
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
                                    <EyeOutlined style={iconStyleEye[i]} onClick={async() => {await getSeeListen(item._id);showModal4()}}
                                    />
                                    <LockOutlined style={iconStyleCadena[i]}/>
                                    <EditOutlined onClick={() => {showModal1(); setCollabIDFeedback(item._id)}} style={iconStyle[i]}/>
                                </div>
                            </List.Item>
                            <Modal visible={visible1} onCancel={handleCancel1} footer={null}>
                                        <Form layout="vertical" >
                                            <h2 className='input-listen'> 
                                            {<Image width='30px' src="./logo-transparent.png" />}
                                            Concernant Luke Skywalker :
                                    </h2>
                                <Form.Item label="Qu'avez vous pensez de la performance de Luke ?" 
                                className='input-listen' >
                                    <Input onChange={(e) => setFeedbackOne(e.target.value)}
                                    value={feedbackOne}/>
                                </Form.Item>
                                <Form.Item label="Qu'attendez vous de Luke pour le mois prochain ?" 
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
                <Popover content={"Le collaborateur sera ajouté à la liste, dès qu'il aura créé son compte"}>
                    <Col onClick={showModal2} span={8} offset={2}>
                    <Button onClick={showModal2} style={{marginBottom:'10px'}} icon={<UserAddOutlined />}>
                    Ajouter un collaborateur à mon équipe
                    </Button>
                    </Col>
                    </Popover>
                    <Col span={6} offset={8} >
                    <Popconfirm
                        placement="topRight"
                        title="Attention : Tous les Listen non complétés seront archivés"
                        onConfirm={confirm}
                        okText="Je lance une nouvelle campagne"
                        cancelText="Retour"
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

                <Modal title="Suppression" visible={visible3} onCancel={handleCancelDelete} footer={<Link to="/dashboard"> <Button key="delete" onClick={suppressionCollab}>
                    Confirmer
                    </Button></Link>}>
                    <p>Souhaitez-vous supprimez définitivement ce collaborateur de votre équipe ?</p>
                </Modal>
                <Modal title="Visionage du listen" visible={visible4} onCancel={handleCancel4} onOk={handleOk4}>
                    <Row>
                        <Col span={6} offset={1}>
                    <h3 strong>Votre feedback</h3>
                    <h4>Qu'avez vous pensez de la performance de Luke ?</h4>
                    <p type="secondary">{seeFeedback.feedback1}</p>
                    <h4>Qu'attendez vous de ce collaborateur pour le mois prochain ?</h4>
                    <p type="secondary">{seeFeedback.feedback2}</p>
                    </Col>
                    <Col span={6} offset={1}>
                    <h3>Son Listen</h3>
                    <h4>Humeur:</h4>
                    <p type="secondary">{seeMood}</p>
                    <h4 >Les points positifs de la période:</h4>
                    <p type="secondary">{seeListen.reponse1}</p>
                    <h4>Quelles ont été les difficultés de la période?</h4>
                    <p type="secondary">{seeListen.reponse2}</p>
                    </Col>
                    <Col span={6} offset={1}> 
                    <h4>Mon objectif prioritaire pour le mois prochain:</h4>
                    <p type="secondary">{seeListen.reponse3}</p>
                    <h4>Qu'attends-je de mon manager pour le mois prochain?</h4>
                    <p type="secondary">{seeListen.reponse4}</p>
                    <h4>Un point sur lequel j'aimerai revenir:</h4>
                    <p type="secondary">{seeListen.reponse5}</p>
                    </Col>
                    </Row>
                </Modal>
                </div>
            )
        }
        else {
            return (
                <Row justify="center" align="middle" style={{height:'100vh'}}>
                    <Col ><img src='./Spinner-1s-200px.gif'/></Col>
                </Row>
           )
         }}

        
 else {
        return (<Redirect to='/historique-collab'/>)
    }
}


function mapStateToProps(state) {
    return { userId: state.user }
}

export default connect(
    mapStateToProps,
    null
)(ScreenDashboard);