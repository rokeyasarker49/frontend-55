import "./App.css";
import profile from "../src/assets/profile.jpeg";
import { useState } from "react";
import { useEffect } from "react";

function App() {

	const [user, setUser] = useState([]);
	const [upUser, setupUser] = useState();
	
	useEffect(() => {
		fetch("https://back-end-04.vercel.app/users")
			.then((response) => response.json())
			.then((data) => setUser(data));
	}, []);

	const openForm = () => {
		document.getElementById("addUser").style.display = "flex";
	};

	const closeForm = () => {
		document.getElementById("addUser").style.display = "none";
		document.getElementById("UpdateUser").style.display = "none";
	};

	const openUpdate = (item) => {

		document.getElementById("UpdateUser").style.display = "flex";
		setupUser(item);
		
	}

	const addUser = (event) => {
		event.preventDefault();

		const from = event.target;
		const userName = from.name.value;
		const age = from.age.value;
		const email = from.email.value;
		const profession = from.profession.value;
		const address = from.address.value;
		const slack = from.slack.value;

		const users = { userName, age, profession, email, address, slack };

		document.getElementById("loader-container").style.display = "grid";

		fetch("https://back-end-04.vercel.app/users", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(users),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.acknowledged) {
					document.getElementById("loader-container").style.display = "none";
					document.getElementById("addUser").style.display = "none";
					event.target.reset();
					document.getElementById("alert-head").style.display = "grid";
				}
			});
	};


	const updateUser = (event) => {

		event.preventDefault();

		document.getElementById("loader-container").style.display = "grid";

		fetch(`https://back-end-04.vercel.app/users/${upUser._id}`, {
			method: "PUT",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(upUser),
		})
		.then(response => response.json())
		.then(data => {

			if (data.modifiedCount > 0) {

				document.getElementById("loader-container").style.display = "none";
				document.getElementById("UpdateUser").style.display = "none";
				event.target.reset();
				document.getElementById("userUpdateAlert").style.display = "grid";
				
			}
		})



	}

	const blurOn = (event) =>{

		const form = event.target.name;
		const value = event.target.value;

		const newUser = {...upUser}
		newUser[form] = value
		setupUser(newUser);
	}

	const CloseAlert = () => {
		document.getElementById("alert-head").style.display = "none";
		window.location.reload();
	};

	const userDelate = (User) =>{

		const agree = window.confirm(`Are you want to delate : ${User.userName}`);
		if (agree) {
			
			fetch(`https://back-end-04.vercel.app/users/${User._id}`, {
				method: 'DELETE'
			})
			.then(response => response.json())
			.then(data => {
				if (data.deletedCount > 0) {
					window.location.reload()
					 alert(`${User.userName} is Delated`);
				}
			})
		}
	}

	return (
		<>
			<div id="alert-head" className="alertBox-head">
				<div className="alert_box">
					<div className="icon">
						<i className="fa-regular fa-address-card"></i>
					</div>
					<header>Confirm</header>
					<p>Your UserAdd is Successfully Done.</p>
					<div className="btns">
						<label onClick={CloseAlert} htmlFor="check">
							Ok
						</label>
					</div>
				</div>
			</div>

			<div id="userUpdateAlert" className="alertBox-head">
				<div className="alert_box">
					<div className="icon">
						<i className="fa-regular fa-address-card"></i>
					</div>
					<header>Confirm</header>
					<p>Your UserUpdate is Successfully Done.</p>
					<div className="btns">
						<label onClick={CloseAlert} htmlFor="check">
							Ok
						</label>
					</div>
				</div>
			</div>

			<div className="container">
				<div className="item">
					<img src={profile} alt="" />
					<div onClick={() => openForm()}>
						<input type="text" placeholder="What's on your mind ?" />
						<button>
							<i className="fa-regular fa-images"></i>
						</button>
					</div>
				</div>

				<div className="UserShowItem">
					
					{user.map(sUser => (
						<>
							<div className="sUser"  key={sUser._id}>
								<h3>{sUser.userName}</h3>
								<p>
									Age : <span>{sUser.age}</span>
								</p>
								<p>
									Profession : <span>{sUser.profession}</span>
								</p>
								<p>
									Email : <span>{sUser.email}</span>
								</p>
								<p>
									Address : <span>{sUser.address}</span>
								</p>

								<div className="sUserBtn">
									<button onClick={() => openUpdate(sUser)}>Update</button>
									<button onClick={() => userDelate(sUser)}>Delete</button>
								</div>
							</div>
						</>
					))}
				</div>
			</div>

			<div id="addUser" className="addUser">
				<form onSubmit={addUser} className="User-Container">
					<p>AddUserDetails</p>
					<div className="Onest">
						<input name="name" type="text" placeholder="UserName" required />
						<input name="age" type="number" placeholder="UserAge" required />
					</div>
					<div className="Twond">
						<input
							name="profession"
							type="text"
							placeholder="UserProfession"
							required
						/>
						<input
							name="email"
							type="email"
							placeholder="UserEmail@Gmail.Com"
							required
						/>
					</div>
					<div className="Threerd">
						<input
							name="address"
							type="text"
							placeholder="UserAdress"
							required
						/>
						<input name="slack" type="text" placeholder="Slack" required />
					</div>

					<button type="submit">AddUser</button>
				</form>

				<button onClick={() => closeForm()} className="buttons">
					<i className="fa-solid fa-xmark"></i>
				</button>
			</div>

			<div id="UpdateUser" className="addUser">
				<form onSubmit={updateUser} className="User-Container">
					<p>UpdateUserDetails</p>
					<div className="Onest">
						<input onBlur={blurOn} defaultValue={upUser?.userName} name="userName" type="text" placeholder="UserName" required />
						<input onBlur={blurOn} defaultValue={upUser?.age} name="age" type="number" placeholder="UserAge" required />
					</div>
					<div className="Twond">
						<input onBlur={blurOn} defaultValue={upUser?.profession} name="profession" type="text" placeholder="UserProfession" required />
						<input onBlur={blurOn} defaultValue={upUser?.email} name="email" type="email" placeholder="UserEmail@Gamil.Com" required />
					</div>
					<div className="Threerd">
						<input onBlur={blurOn} defaultValue={upUser?.address} name="address" type="text" placeholder="UserAdress" required />
						<input onBlur={blurOn} defaultValue={upUser?.slack} name="slack" type="text" placeholder="Slack" required />
					</div>

					<button type="submit">Update</button>
				</form>

				<button onClick={() => closeForm()} className="buttons">
					<i className="fa-solid fa-xmark"></i>
				</button>
			</div>

			<div id="loader-container" className="loader-container">
				<span class="loader"></span>
			</div>
		</>
	);
}

export default App;
