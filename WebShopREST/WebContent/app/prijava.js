Vue.component("prijava", {
    data: function () {
        return {
            username: "",
            password: "",
            allDataEntered: true,
            userExist: true,
        };
    },
    template: `
     <div>
        
                <h1>Prijavite se</h1>

                <p class="white">Korisničko ime:</p>
                <input
                    v-model="username"
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Korisničko ime"
                />
                <p class="white">Lozinka:</p>
                <input
                    v-model="password"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Lozinka"
                />
                <br />

                <p class="white"
                    style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    "
                >
                    <input
                        class="checkbox"
                        type="checkbox"
                        id="showPassword"
                        onclick="myFunction() "
                    />
                    <label class="white" for="checkbox"> Prikaz lozinke </label>
                </p>

                <br />

                <button v-on:click="Login">Prijavite se</button>

                <p class="white" v-if="!allDataEntered">Niste uneli sve podatke</p>
                <p class="white" v-if="!userExist">Ne postoji korisnik sa tom sifrom</p>
           
        </div>`,
    mounted() {
        if (JSON.parse(localStorage.getItem("loggedInUser")) !== null) {
            alert(
                "Ne može se izvršiti prijavljivanje dok ste prijavljeni. Odjavite se i pokušajte ponovo."
            );
            window.location.href = "#/pocetna";
            return;
        }
    },

    methods: {
        Login: function () {
            this.allDataEntered = true;
            this.userExist = true;
            if (this.username === "" || this.password === "") {
                this.allDataEntered = false;
                return;
            }

            const params = new URLSearchParams();
            params.append("username", this.username);
            params.append("password", this.password);
            axios
                .post("rest/login/token", params, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                })
                .then((response) => {
                    localStorage.setItem(
                        "token",
                        response.headers.authorization
                    );
                    this.$root.VarToken();
                })
                .catch((error) => {
                    this.userExist = false;
                });
        },
    },
});
