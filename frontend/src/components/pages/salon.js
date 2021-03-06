import React, { Component } from 'react';
import $ from 'jquery'; 
import { useSelector} from 'react-redux'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import SalonGames from './games/salon_games'
import Sapou from './partials/sapou';

import About from './other_pages/about';
import Support from './other_pages/support';
import Terms from './other_pages/terms';
import Privacy from './other_pages/privacy';
import Questions from './other_pages/questions';
import Career from './other_pages/career_empty';

import { getCookie, setCookie, showResults } from '../utils';
import UserRace from './userRace';
import { game_page } from '../actions/actions';

var casino_games = {
	roulette_tables: [], 
	blackjack_tables: [],
	slots_tables: [],
	craps_tables: []
}
var casino_games_title = Object.getOwnPropertyNames(casino_games);

function Child(props){
	let lang = props.lang;
	let casino_games_title = props.casino_games_title;
	let socket = props.socket;
	let user_id = props.user_id;
	let user = props.user;
	let casino_games = props.casino_games;
	let visible = useSelector(state => state.visibility);
	let dispatch = props.dispatch;
	return(
		<div>	
			{(() => {
				if(dispatch){
					dispatch(game_page(visible))
				}
				switch (visible) {
					case "game":
						return (
							<div>
								<Sapou lang={lang} page="salon"></Sapou>
								<SalonGames lang={lang} dispatch={dispatch} casino_games_title={casino_games_title} socket={socket} user={user} casino_games={casino_games}></SalonGames>
							</div>
						)
					case "about":
						return (
							<div>
								<Sapou lang={lang} page={visible}></Sapou>
								<About lang={lang} dispatch={dispatch} socket={socket} user_id={user_id} user={user}></About>
							</div>
						)	
					case "support":
						return (
							<div>
								<Sapou lang={lang} page={visible}></Sapou>
								<Support lang={lang} dispatch={dispatch} socket={socket} user_id={user_id} user={user}></Support>
							</div>
						)
					case "terms":
						return (
							<div>
								<Sapou lang={lang} page={visible}></Sapou>
								<Terms lang={lang} dispatch={dispatch} casino_games_title={casino_games_title} socket={socket} user_id={user_id} user={user} casino_games={casino_games}></Terms>
							</div>
						)
					case "privacy":
						return (
							<div>
								<Sapou lang={lang} page={visible}></Sapou>
								<Privacy lang={lang} dispatch={dispatch} socket={socket} user_id={user_id} user={user}></Privacy>
							</div>
						)
					case "questions":
						return (
							<div>
								<Sapou lang={lang} page={visible}></Sapou>
								<Questions lang={lang} dispatch={dispatch} socket={socket} user_id={user_id} user={user}></Questions>
							</div>
						)
					case "career":
						return (
							<div>
								<Sapou lang={lang} page={visible}></Sapou>
								<Career lang={lang} dispatch={dispatch} socket={socket} user_id={user_id} user={user}></Career>
							</div>
						)
					default:
						return(
							<div>
								{lang === "ro" ? <p>Ceva s-a intamplat.</p> : <p>Something went wrong.</p>}
							</div>							
						)						
				}
			})()}					
		</div>		
	);
}

class Salon extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			socket: props.socket,
			lang: props.lang,
			empty: false,
			casino_games: '',
			user: '',
			race: false,
			id: -1,
			money: 0,
			loaded: false,
			page: props.page,
	  	};		
		this.handleBack = this.handleBack.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.salonData = this.salonData.bind(this);
	}
  
	componentDidMount() {
		let self = this;
		this.salonData()
			.then(res => {
				if(res){
					for(let i in res.server_tables){
						switch (res.server_tables[i].table_name) {
							case "roulette":
								casino_games.roulette_tables.push(res.server_tables[i]);
							  	break;
							case "blackjack":
								casino_games.blackjack_tables.push(res.server_tables[i]);
							  	break;
							case "slots":
								casino_games.slots_tables.push(res.server_tables[i]);
								break;
							case "craps":
								casino_games.craps_tables.push(res.server_tables[i]);
								break;	
							default:
								break;						
						  }
					}
					
					let empty = 0;
					for(let j in casino_games_title){
						if(casino_games[casino_games_title[j]].length === 0){
							empty++;
						}
					}

					if(res.first_enter_salon){
						if(self.props.lang === "ro"){
							showResults('Cadou de bun-venit', 'Ai 100 de morcovi cadou de bun-venit.');
						} else {
							showResults('Welcome gift', 'First time players get 100 carrots!');
						}						
					}

					if(empty === casino_games_title.length){
						self.setState({ empty: true }); 
					} else {
						self.setState({ casino_games: casino_games });
						self.setState({ money: res.money });						
					}
				} else {
					setCookie("casino_user", '', 1);
					self.setState({ user: '' });
				}
				self.setState({ loaded: true });
			}).catch(err => console.log(err));	
	}
	
	salonData(){
		let self = this;
		return new Promise(function(resolve, reject){
			let casino_id = getCookie("casino_id");
			let casino_user = getCookie("casino_user");

			self.setState({ user_id: parseInt(casino_id) });
			self.setState({ user: casino_user });

			//setTimeout(function(){
				self.state.socket.emit('salon_send', self.state.user_id);	
				self.state.socket.on('salon_read', function(data){
					resolve(data);	
				});	
			//}, 1000);
		});
	};

	handleBack() {
		setCookie("casino_id", '', 1);
		setCookie("casino_user", '', 1);
		setCookie("casino_email", '', 1);
		let url = window.location.href;
		url = url.split('/salon');
		window.location.href = url[0];
	}

	handleChange(type){
		if(type === "games"){	
			this.setState({ race: false })
		} else if(type === "race"){
			this.setState({ race: true })
		}
	}
  
	render() { 
		let lang = this.props.lang;
		let opened = "";
		if($('#loader_container')){
			$('#loader_container').show();
		}	
		if(this.state.loaded){
			opened = " open";
			if($('#loader_container')){
				$('#loader_container').hide();
			}
		}
		return (
			<div>
				{this.state.empty ? (
					<div className="color_yellow">
						{lang === "ro" ? <span>Nu exista mese</span> : <span>No tables</span>}
					</div>
				) : (
					<Row>						
						{this.state.user === '' &&  this.state.loaded ? (
							<div className="table_container color_yellow">
								{lang === "ro" ? 
									<div>
										<h3>Acces interzis</h3>
										<h4>Intoarce-te si logheaza-te/inregistreaza-te</h4>
										<Button className="button_table shadow_convex" type="button" onClick={()=>this.handleBack()}>
											{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
										</Button>
									</div> : 
									<div>
										<h3>No access</h3>
										<h4>Please go back and login in / sign in</h4>
										<Button className="button_table shadow_convex" type="button" onClick={()=>this.handleBack()}>
											{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
										</Button>
									</div>
								}								
							</div>
						) : (
							<div>
								<div className={"salon_button_container"+opened}>
									<div className="salon_button_box">
										<div id="salon_buton_games" className="salon_button shadow_convex" onClick={()=>{this.handleChange('games')}}>
											{lang === "ro" ? <span><i className="fa fa-smile-o"></i>Jocuri</span> : <span><i className="fa fa-smile-o"></i>Games</span>}											
										</div>            
										<div id="salon_buton_race" className="salon_button shadow_convex" onClick={()=>{this.handleChange('race')}}>
											{lang === "ro" ? <span><i className="fa fa-flag-checkered"></i>Curse</span> : <span><i className="fa fa-flag-checkered"></i>Race</span>}	
										</div>
									</div>
								</div>
								{this.state.loaded ? <Col sm={12} className="salon_page color_yellow">
									{this.state.race ? (
										<UserRace race={this.state.race} lang={lang} user_id={this.state.user_id} user={this.state.user} money={this.state.money} user_table={"Rabbit Race"} socket={this.state.socket}></UserRace>						
									) : (
										<Child lang={lang} dispatch={this.props.dispatch} casino_games_title={casino_games_title} socket={this.state.socket} user_id={this.state.user_id} user={this.state.user} casino_games={casino_games}></Child>
									)}
								</Col> : null}
							</div>																
						)}			
					</Row>
				)}
			</div>
		);		
	}
}

export default Salon;