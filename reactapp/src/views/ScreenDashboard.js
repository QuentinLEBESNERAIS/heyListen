import React,{useState,useEffect} from 'react';
import '../App.css';
import {Layout,Divider,Button,Card,Row,Col,Progress,Input,Form,List,Avatar,Tag,Typography,Modal,Image, message, Popconfirm,Popover} from 'antd'
import {SyncOutlined, SendOutlined,EditOutlined,EyeOutlined,LockOutlined,UserAddOutlined, DeleteOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom'
import Nav from './Nav'
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import invite from '../Invite.svg'

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
    const [collabIDFeedback,setCollabIDFeedback] = useState('')
    const [idCollab, setIdCollab] = useState('')
    const [search,setSearch] = useState('')
    const [filteredTeam, setFilteredTeam] = useState([])
    const [pageLoaded, setPageLoaded] = useState(false)
    const [seeListen,setSeeListen] = useState({reponse1: "", reponse2: "", reponse3: "", reponse4: "", reponse5: ""})
    const [seeFeedback,setSeeFeedback] = useState({feedback1: "", feedback2: ""})
    const [seeMood,setSeeMood] = useState(0)
    const [isNewCampaign, setIsNewCampaign] = useState(false)
    const [nameToDisplay,setNameToDisplay] = useState("")
    const [stats,setStats] = useState([{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1}])

//Initiales avatar liste collab
    var firstMaj = (a) =>{
        return ( 
            (a+'').charAt(0).toUpperCase()
            );
    }

//Affichage collab 
    useEffect(()=> {
        var getBddCollab = async () => {
            var rawResponse = await fetch(`/users/find-collab?manager=${props.userId._id}`);
            var collabs = await rawResponse.json();
            setTeam(collabs.collabs)
            setFilteredTeam(collabs.collabs)
        }
//Fetch en BDD pour r??cuperer les stats pour le graphique
        var handleStatsRoute = async () =>{
            var response = await fetch(`/get-stats?manager=${props.userId._id}`);
            var statsListen = await response.json();
                setStats(statsListen.monthFinal)
            setPageLoaded(true)
        }
        if(props.userId.type === 'manager'){getBddCollab();handleStatsRoute()}
    },[])

//Fetch en BDD pour affichage en temps r??el pour lancement d'une nouvelle campagne
    useEffect(()=> {
        var getBddCollab = async () => {
            var rawResponse = await fetch(`/users/find-collab?manager=${props.userId._id}`);
            var collabs = await rawResponse.json();
            setTeam(collabs.collabs)
            setFilteredTeam(collabs.collabs)
            setPageLoaded(true)
        }
        var handleStatsRoute = async () =>{
            var response = await fetch(`/get-stats?manager=${props.userId._id}`);
            var statsListen = await response.json();
            setStats(statsListen.monthFinal)
        }
        if(props.userId.type === 'manager'){getBddCollab();handleStatsRoute()}
    },[isNewCampaign])

// Recherche collab dans input search qui se MAJ ?? chaque changement de l'??tat 'search'
    useEffect(()=> {
        const results = team.filter(person => person.firstName.toLowerCase().includes(search.toLocaleLowerCase()) || person.lastName.toLowerCase().includes(search.toLocaleLowerCase()));
        setFilteredTeam(results)
    },[search])

// Param??tres modale feedback manager/ de nouveau fetch en BDD pour affichage en temps r??el
    const showModal1 = (name) => {
        setNameToDisplay(name)
        setVisible1(true);
    };

    const handleOk1 =  () => {
        var saveFeedback = async () => {
            await fetch('/save-feedback', {
                method: 'PUT',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `id=${collabIDFeedback}&feedback1=${feedbackOne}&feedback2=${feedbackTwo}`
            });
            setFeedbackOne('');
            setFeedbackTwo('');
        }
        saveFeedback();
        setVisible1(false);
        var getBddCollab = async () => {
            var rawResponse = await fetch(`/users/find-collab?manager=${props.userId._id}`);
            var collabs = await rawResponse.json();
            setTeam(collabs.collabs)
            setFilteredTeam(collabs.collabs)
        }
        if(props.userId.type == 'manager'){getBddCollab()}
    };

    const handleCancel1 = () => {
        setVisible1(false);
    };

// Param??tres modale ajout de collab avec v??rifaction que l'email est valide
    const showModal2 = () => {
        setVisible2(true);
    };

    const handleOk2 = async () => {
        if (collabEmail) {
            var emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);
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
                    await fetch('/mail/invite', {
                        method: 'POST',
                        headers: {'Content-Type':'application/x-www-form-urlencoded'},
                        body: `collabEmail=${collabEmail}`
                    });
                    var response = await responseRaw.json();
                    const info = () => {
                        message.info(response.response);
                    }
                    info();
                    setCollabEmail('')
                } 
                await saveCollab()
                setVisible2(false);
                setErrorMessage('')
            }
        }
    };

    const handleCancel2 = () => {
        setVisible2(false);
        setCollabEmail('')
        setErrorMessage('')
    };

// NEW CAMPAIGN
    var newCampaignLaunch = async () => {
        const data = await fetch('/new-campaign', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `idFromFront=${props.userId._id}`
        })
        const info = () => {
            message.info('Nouvelle campagne lanc??e avec succ??s !');
        }
        info();
        await data.json()
        setIsNewCampaign(true)
    }

    function confirm() {
        setIsNewCampaign(false)
        newCampaignLaunch()
    }

//FONCTION POUR RELANCER TOUS LES COLLAB PAR MAIL
    const relaunch = async () => {
        const rawRelaunchData = await fetch('/mail/relaunch', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `idFromFront=${props.userId._id}`
        }) 
        let relaunchData = await rawRelaunchData.json()
        const info = () => {
            message.info('Vos collaborateurs ont ??t?? relanc??s');
        }
        if(relaunchData==="relanc??"){info()}
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
            setTeam(team.newManagerTeam)
        } 
        suppCollab();
        setVisible3(false);
    };

// Charts stat de la moyenne des humeurs de l'??quipe pour les 6 derniers mois
    var month = stats.map(item => item.date);
    var data = stats.map(item => item.mood);

    const state = {
        labels: month,
        datasets: [{label: 'Humeur', backgroundColor: 'rgba(152,193,217,0.7)', borderColor: '#003566', borderWidth: 2, fill: true, lineTension: 0.4, data: data}]
    }

//changement couleur Tag collab
    for(var i=0; i<filteredTeam.length;i++){
    var color
    var text
    var iconDisplayEye 
        if(filteredTeam[i].listen === false){
            color = 'rgba(186,24,27,0.6)'
            text = "Ce collaborateur n'a pas rempli son Listen"
        }else if (filteredTeam[i].listen === true){
            color = 'rgba(43,147,72,0.6)'
            text = "Ce collaborateur a rempli son Listen"
        }
        filteredTeam[i].listentag = <Tag color={color} style={{width:250,borderRadius:'10px',textAlign:'center'}}>{text}</Tag> 
    }

//changement couleur et icon cadena/crayon Tab collab
    for(var i=0; i<filteredTeam.length;i++){
        var colorFeedback
        var textFeedback
        var iconDisplay
        var iconDisplayCadena
        if(filteredTeam[i].feedback === false){
            colorFeedback = 'rgba(186,24,27,0.6)'
            textFeedback = "Vous n'avez pas rempli votre partie"
            iconDisplay = { fontSize: '24px',color:'#003566' }
            iconDisplayCadena = { fontSize: '24px',display:'none' }
        }else{
            colorFeedback = 'rgba(43,147,72,0.6)'
            textFeedback = "Vous avez rempli votre partie"
            iconDisplay = { fontSize: '24px',display:'none' }
            iconDisplayCadena = { fontSize: '24px',color:'#003566' }
        }
        filteredTeam[i].feedbacktag= <Tag color={colorFeedback} style={{width:250,borderRadius:'10px',textAlign:'center'}}>{textFeedback}</Tag>
        filteredTeam[i].iconStyle = iconDisplay
        filteredTeam[i].iconStyleCadena = iconDisplayCadena
    }

//changement icon oeil
    for (var i=0; i<filteredTeam.length;i++){
        var iconDisplayEye  
        if (filteredTeam[i].listen===true && filteredTeam[i].feedback===true){
            iconDisplayEye = { fontSize: '24px',color:'#003566'}
        } else {
            iconDisplayEye = { fontSize: '24px', display:'none' }
        }
        filteredTeam[i].iconStyleEye = iconDisplayEye 
    }

// Taux de compl??tion 
    var listenCompleted = 0
    for (var i=0; i<team.length;i++){ 
        if (team[i].listen===true){
            listenCompleted += 1
        }
    }
    var completion = Math.floor((listenCompleted / team.length) * 100)

// Affichage modal visionnage du listen
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

    const handleCancel4 = () => {
        setVisible4(false);
    };
    
    if(props.userId.type==="manager"){
        if (pageLoaded){
            return (
                <Layout>  
                    <Nav/>
                    <div style={{background: 'linear-gradient(180deg, #007DB3, #005295 50%, #003376)', width:'100%', minHeight: '100vh'}}>
                        <div style={{marginTop:"60px"}}>
                            <Row style={{height:205, marginTop:0}}>
                                <Col span={4} offset={1} >
                                    <Card style ={{ textAlign:'center', filter:'drop-shadow(1px 2px 5px #555555)', borderRadius:20}}>
                                        <h4 >
                                            Taux de compl??tion
                                            <Divider style={{marginTop:7, marginBottom:27}}/>        
                                            <Progress strokeColor={{'0%': '#003566','100%': '#00BFA6',}} percent={completion} type='circle' status="active"/>
                                        </h4> 
                                    </Card>
                                </Col>
                                <Col span={18}>
                                    <Card style={{filter:'drop-shadow(1px 2px 5px #555555)',height:233, borderRadius:20, marginLeft:18}}>
                                        <h4 style={{marginLeft:5}}>
                                            Humeur de mon ??quipe
                                        </h4>
                                        <Divider style={{margin:4}}/>
                                        <div style={{height:170}}>
                                            <Line responsive={true} height={50} data={state} options={{maintainAspectRatio:false, animation: false, title:{display:false,}, scales: {y: {min: 1,max: 5,}}, legend:{display:true,}, plugins:{legend:{display:false}}}}></Line>
                                        </div>
                                    </Card> 
                                </Col>
                            </Row>
                            <Row >
                                <Col span={22} offset={1} style={{marginTop:40}}>
                                    <Card style ={{filter:'drop-shadow(1px 2px 5px #555555)', borderRadius:20}}>
                                        <Row >
                                            <Col span={4} >
                                                <Button onClick={relaunch}  icon={<SendOutlined />} style={{filter:'drop-shadow(1px 1px 1px #003566)', borderColor:'#003566', color:'#003566',borderRadius:10, width:'266px'}}>
                                                    Relancer tous les collab.
                                                </Button>
                                            </Col>
                                            <Popover content={"Le collaborateur sera ajout?? ?? la liste, d??s qu'il aura cr???? son compte"}>
                                                <Col span={4} offset={2}>
                                                    <Button onClick={showModal2} style={{ borderColor:'#003566', color:'#003566',borderRadius:10,width:'266px',filter:'drop-shadow(1px 1px 1px #003566)'}} icon={<UserAddOutlined />}>
                                                        Inviter un collaborateur
                                                    </Button>
                                                </Col>
                                            </Popover>
                                            <Popconfirm placement="topRight" title="Attention : Tous les Listens non compl??t??s seront archiv??s" onConfirm={confirm} okText="Je lance une nouvelle campagne" cancelText="Retour">
                                                <Col span={4} offset={2}>
                                                    <Button icon={<SyncOutlined />} style={{ borderColor:'#003566', color:'#003566',width:'266px',borderRadius:10,filter:'drop-shadow(1px 1px 1px #003566)'}}>
                                                        Lancer une campagne Listen
                                                    </Button>
                                                </Col>
                                            </Popconfirm>
                                            <Col span={4} offset={2}>
                                                <Form style={{fontWeight:'500', display:'inline'}}>
                                                    <Input.Search placeholder="Collaborateur" allowClear onChange={(e) => setSearch(e.target.value)}  style={{ width:'266px',borderRadius:10}} />
                                                </Form>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row style={{marginTop:12, marginBottom:12}}>
                                <Col span={22} offset={1}>
                                    <Card style ={{filter:'drop-shadow(1px 2px 5px #555555)',borderRadius:20}}>
                                        <List itemLayout="horizontal" >
                                            {filteredTeam.map((item,i) => (
                                                <div key={i}>
                                                    <List.Item actions={[<a key="delete"><Button type="link" onClick={()=> handleDelete(item._id) }><DeleteOutlined style={{fontSize: '20px', color:'#003566'}}/></Button></a>]} style={{border:'1px solid #003566', backgroundColor:'#F9FAFD', color,padding:10,margin:5, borderRadius:20}}>
                                                        <table>
                                                            <tr>
                                                                <td style={{width:40}}>
                                                                    <Avatar style={{ border:'1px solid #003566',backgroundColor:'#ffffff',color:'#003566', verticalAlign: 'middle' }} size="large">
                                                                        {firstMaj(item.firstName)}{firstMaj(item.lastName)}
                                                                    </Avatar>
                                                                </td> 
                                                                <td style={{width:250,textAlign:'center'}}>
                                                                    <Typography.Text style={{color:'#003566'}}>{item.firstName} {item.lastName}</Typography.Text>
                                                                </td>
                                                                <td style={{width:300,textAlign:'center'}}>
                                                                    {filteredTeam[i].listentag}
                                                                </td>
                                                                <td style={{width:300,textAlign:'center'}}>
                                                                    {filteredTeam[i].feedbacktag}
                                                                </td>
                                                                <td style={{width:200,textAlign:'center'}}>
                                                                    <EyeOutlined style={filteredTeam[i].iconStyleEye} onClick={async() => {await getSeeListen(item._id);showModal4()}}/>
                                                                    <LockOutlined style={filteredTeam[i].iconStyleCadena}/>
                                                                    <EditOutlined onClick={() => {showModal1(item.firstName); setCollabIDFeedback(item._id)}} style={filteredTeam[i].iconStyle}/>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </List.Item>
                                                    
                                                    <Modal visible={visible1} onCancel={handleCancel1} footer={null}>
                                                        <Form layout="vertical" >
                                                            <h2 className='input-listen'> 
                                                                {<Image width='30px' src="./logo-transparent.png" />}Concernant {nameToDisplay}
                                                            </h2>
                                                            <Form.Item label="Qu'avez-vous pens?? de la performance de ce collaborateur ?" className='input-listen'>
                                                                <Input onChange={(e) => setFeedbackOne(e.target.value)} value={feedbackOne}/>
                                                            </Form.Item>
                                                            <Form.Item label="Qu'attendez-vous de lui pour le mois prochain ?" className='input-listen'>
                                                                <Input onChange={(e) => setFeedbackTwo(e.target.value)}value={feedbackTwo}/>
                                                            </Form.Item>
                                                            <Form.Item layout="horizontal" style={{marginTop:30}}>
                                                                <Button key="back" htmlType="submit" style={{marginLeft:260,marginTop:10,borderColor:'#0065A2', color:'#0065A2',borderRadius:'5px'}} onClick={handleCancel1}>
                                                                    Annuler
                                                                </Button>
                                                                <Button key="submit" style={{marginLeft:5,marginTop:10,borderColor:'#0065A2', color:'#0065A2',borderRadius:'5px'}}onClick={()=> handleOk1()}>
                                                                    Valider
                                                                </Button>
                                                            </Form.Item>
                                                        </Form>
                                                    </Modal>
                                                </div>
                                            ))}
                                        </List> 
                                    </Card> 
                                </Col>
                            </Row> 

                            <Modal visible={visible2} onCancel={handleCancel2} footer={null} width={850} height={500}>
                                <div style={{color:'red', display:'flex', justifyContent:'center'}}>
                                    {errorMessage}
                                </div>
                                <Row>
                                    <Col span={8}>
                                        <img src={invite} height={270}/>
                                    </Col>
                                    <Col span={16}>
                                        <Form layout="vertical" >
                                            <h2 className='input-listen'> 
                                                {<Image width='30px' src="./logo-transparent.png" />}
                                                Collaborateur ?? inviter
                                            </h2>
                                            <Form.Item  style={{marginTop:45,padding:0, width:400, marginLeft:50}}>
                                                <Input placeholder='Email du collaborateur' onChange={(e) => setCollabEmail(e.target.value)} value={collabEmail}/>
                                            </Form.Item>
                                            <Form.Item style={{marginTop:40}}>
                                                <Button key="back" htmlType="submit" style={{marginLeft:150, borderColor:'grey', color:'grey',borderRadius:10,filter:'drop-shadow(1px 1px 1px grey)'}} onClick={handleCancel2}>
                                                    Annuler
                                                </Button>
                                                <Button key="submit" icon={<UserAddOutlined />} style={{marginLeft:10, borderColor:'#003566', color:'#003566',borderRadius:10,filter:'drop-shadow(1px 1px 1px #003566)'}} onClick={()=> handleOk2()}>
                                                    Ajouter ce collaborateur
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Col>
                                </Row>
                            </Modal>

                            <Modal className='center' title="Suppression" visible={visible3} onCancel={handleCancelDelete} footer={<Link to="/dashboard"> <Button key="delete" onClick={suppressionCollab}>Confirmer</Button></Link>}>
                                <p>Souhaitez-vous supprimer d??finitivement ce collaborateur de votre ??quipe ?</p>
                            </Modal>
                            <Modal width= {1200} height= {900} visible={visible4} footer={null} onCancel={handleCancel4}>
                                <Row>
                                    <Col span={6} offset={1}>
                                        <h3 style={{color:'#006ba6'}}>Votre feedback</h3>
                                        <Divider/>
                                    </Col>
                                    <Col span={14} offset={2}>
                                        <h3 style={{color:'#006ba6'}}>Son Listen</h3>
                                        <Divider/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={7} offset={1}>
                                        <h4>Qu'avez-vous pens?? de la performance de ce collaborateur ?</h4>
                                        <p style={{color:'#006ba6'}}>{seeFeedback.feedback1}</p>
                                        <h4>Qu'attendez-vous de ce collaborateur pour le mois prochain ?</h4>
                                        <p style={{color:'#006ba6'}}>{seeFeedback.feedback2}</p>
                                    </Col>
                                    <Col span={7} offset={1}>
                                        <h4>Humeur :  <span style={{color:'#006ba6'}}> {seeMood}</span></h4>
                                        <h4 >Les points positifs de la p??riode:</h4>
                                        <p style={{color:'#006ba6'}}>{seeListen.reponse1}</p>
                                        <h4>Quelles ont ??t?? les difficult??s de la p??riode ?</h4>
                                        <p style={{color:'#006ba6'}}>{seeListen.reponse2}</p>
                                        <h4>Mon objectif prioritaire pour le mois prochain:</h4>
                                        <p style={{color:'#006ba6'}}>{seeListen.reponse3}</p>
                                    </Col>
                                    <Col span={7} offset={1}> 
                                        <h4>Qu'attends-je de mon manager pour le mois prochain ?</h4>
                                        <p style={{color:'#006ba6'}}>{seeListen.reponse4}</p>
                                        <h4>Un point sur lequel j'aimerais revenir:</h4>
                                        <p style={{color:'#006ba6'}}>{seeListen.reponse5}</p>
                                    </Col>
                                </Row>
                            </Modal>
                        </div>
                    </div>
                </Layout>
            )
        } else {
            return (
                <Row justify="center" align="middle" style={{height:'100vh'}}>
                    <Col>
                        <img src='./Spinner-1s-200px.gif'/>
                    </Col>
                </Row>
            )
        }
    }

    else if(props.userId.type==="collab"){ 
        return (<Redirect to='/dashboard-collab'/>)
    } else {
        return (<Redirect to='/'/>)
    }
}

function mapStateToProps(state) {
    return { userId: state.user }
}

export default connect(
    mapStateToProps,
    null
)(ScreenDashboard);