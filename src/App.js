import React from 'react';
import './App.css';


let API = "https://api.spacexdata.com/v3/launches"
let QS = "?sort=flight_number&order=desc&filter=mission_name,launch_date_utc,launch_failure_details/reason,launch_success,upcoming,rocket";
let rowLimit = 125;
let tableHeader = <tr> 
					<th width={300}> Mission </th> 
					<th width={100}> Date </th> 
					<th width={100}> Rocket </th> 
					<th> Payload </th>
					<th> Launch Status </th>
				</tr>

class App extends React.Component {
	constructor( props ){
		super( props );  
		this.state = {
			data: []
		};
	}	
	
	render() {
		const rows = []
		for ( let i = 0; i < rowLimit; i++ ) {
			if ( this.state.data[i] ) {
				rows.push( <Row data={ this.state.data[i] }/> )
			}
		};
		if ( !this.state.data[0] ) return "Loading...";
		return <div>
			<h1 align="center"> SpaceX Launches </h1>
			<table className="launchTable" border="20px" align="center">
				{ tableHeader }
				{ rows }
			</table>
		</div>
	}
  
	componentDidMount() {
		fetch( API + QS )
		.then(response => response.json())
		.then(data => this.setState({ data }));
	}
}

class Row extends React.Component {
	constructor( props ){
		super( props );  
		this.state = {
			data: []
		};
	}
	
	render() {
		if ( this.props.data ) {
			const data = this.props.data
			return <tr>
						<td align="center"> { missionName( data ) } </td>
						<td align="center"> { centralDate( data ) } </td>
						<td align="center"> { rocketName( data ) } </td>
						<td align="center"> { cargo( data ) } </td>
						<td align="center"> { launchStatus( data ) } </td>
					</tr>
		}
		return "...";
	}
}

function missionName( data ) {
	return data.mission_name
}

function centralDate( data ) {
	const date = new Date( data.launch_date_utc );
	let hour = date.getHours();
	let minutes = date.getMinutes();
	if ( hour.toString().length === 1 ) hour = '0' + hour;
	if ( minutes.toString().length === 1 ) minutes = '0' + minutes;
	let str = date.toDateString() + ' - ' + hour + ':' + minutes
	return str
}

function rocketName( data ) {
	return data.rocket.rocket_name
}

function cargo( data ) {
	if (!data.rocket.second_stage.payloads) return "none";
	let payloads = data.rocket.second_stage.payloads
	
	let payloadData = []
	for ( const i in payloads ){
		if ( i > 0 ) payloadData.push( " / " )
		let txt = payloads[i].payload_id;
		let link = payloads[i].cargo_manifest
		payloadData.push( payloads[i].cargo_manifest ? <a href={link}> {txt} </a> : txt )
	}
	return payloadData
}

function launchStatus( data ) {
	if ( data.launch_success ) return "Successful";
	if ( data.upcoming ) return "Upcoming";
	if ( data.launch_failure_details ) {
		if ( data.launch_failure_details.reason ) return "Failed: " + data.launch_failure_details.reason;
		return "Failed"
	}
	return "Launched"
}

export default App;