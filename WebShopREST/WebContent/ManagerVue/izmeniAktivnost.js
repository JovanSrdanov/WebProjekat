Vue.component("izmeniAktivnost", {
    data: function () {
        return {
            odlData: {},

            facId: null,
            allEntered: "",
            alreadyExists: "",
            selectedTrainer: {},
            trainerId: null,
            allTrainers: {},
            name: "",
            workoutType: "",
            durationInMinutes: null,
            description: "",
            showPicture: null,
            price: 0,
        };
    },
    template: `
       <div>
            <div class="WholeScreen">
                <h1>Izmeni aktivnost</h1>
                <div
                    v-if="workoutType=='personal' || workoutType=='group' "
                    class="ChooseTrainer"
                >
                    <table>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Korisničko ime</th>
                        <tbody>
                            <tr
                                v-for="T in allTrainers"
                                v-on:click="selectT(T)"
                                v-bind:class="{selectedTrainerClass : selectedTrainer.id===T.id}"
                            >
                                <td>{{T.name}}</td>
                                <td>{{T.surname}}</td>
                                <td>{{T.username}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p class="white">Naziv:</p>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Naziv"
                    v-model="name"
                />
                  <p class="white">Cena:</p>
            <input
                type="number"
                min="0"
                name="Cena"
                id="Cena"
                v-model="price"
            />

                <p class="white">Tip aktivnosti</p>
                <select
                    name="workoutType"
                    id="workoutType"
                    v-model="workoutType"
                >
                    <option value="personal">Personalni trening</option>
                    <option value="group">Grupni trening</option>
                    <option value="solo">Aktivnost bez trenera</option>
                </select>

                <p
                    class="white"
                    v-if="workoutType=='personal' || workoutType=='group' "
                >
                    Trener: {{selectedTrainer.name}} {{selectedTrainer.surname}}
                </p>

                <p class="white">
                    Trajanje u minutima:
                    <input
                        min="1"
                        max="180"
                        v-model="durationInMinutes"
                        type="number"
                        name="durationInMinutes"
                        id="durationInMinutes"
                    />
                </p>
                <p class="white">Opis:</p>
                <textarea
                    rows="4"
                    cols="50"
                    name="description"
                    id="description"
                    v-model="description"
                    placeholder="Opis.."
                />

                <p>
                    <img
                        v-bind:src="showPicture"
                        height="200px"
                        width="200px"
                    />
                </p>

                <button v-on:click="UpdateActivity">Izmeni</button>
                <p class="white">{{allEntered}}{{alreadyExists}}</p>
            </div>
        </div>  
  `,
    mounted() {
        this.facId = this.$route.params.id;
        this.activityId = this.$route.params.activityId;

        if (JSON.parse(localStorage.getItem("loggedInUser")) === null) {
            alert("Nemate pristup ovom sadržaja");
            window.location.href = "#/pocetna";
            return;
        }
        if (
            JSON.parse(localStorage.getItem("loggedInUser")).role != "manager"
        ) {
            alert("Nemate pristup ovom sadržaja");
            window.location.href = "#/pocetna";
            return;
        }
        if (
            JSON.parse(localStorage.getItem("loggedInUser")).facilityId !=
            this.facId
        ) {
            alert("Nemate pristup ovom sadržaja");
            window.location.href = "#/pocetna";
            return;
        }

        yourConfig = {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        };

        axios.get("rest/trainer", yourConfig).then((response) => {
            this.allTrainers = response.data;

            axios.get("rest/workout/" + this.activityId).then((result) => {
                this.odlData = result.data;
                this.name = this.odlData.name;
                this.workoutType = this.odlData.workoutType;
                this.durationInMinutes = this.odlData.durationInMinutes;
                this.description = this.odlData.description;
                this.price = this.odlData.price;

                this.showPicture = "ActivityPictures/" + this.odlData.picture;
                this.trainerId = this.odlData.trainerId;

                if (this.trainerId !== -1) {
                    this.selectedTrainer = this.allTrainers.find((obj) => {
                        return obj.id === this.trainerId;
                    });
                }
            });
        });
    },
    methods: {
        selectT: function (t) {
            if (!t) {
                this.selectedTrainer = null;
            }
            this.selectedTrainer = t;
        },
        UpdateActivity: function () {
            this.allEntered = "";
            this.alreadyExists = "";

            if (isNaN(this.durationInMinutes)) {
                alert("Unestite brojcanu vrednost trajanja");
                return;
            }
            if (this.durationInMinutes < 1 || this.durationInMinutes > 180) {
                alert(
                    "Unestite validan broj minuta trajanja aktivnosti (1-180)"
                );
                return;
            }
            if (isNaN(this.price)) {
                alert("Unestite brojcanu vrednost cene");
                return;
            }
            if (this.price < 0) {
                alert("Cena ne može biti negativna");
                return;
            }

            if (this.name === "") {
                this.allEntered = "Niste uneli sve podatke";
                return;
            }
            if (this.workoutType !== "solo" && !this.selectedTrainer) {
                this.allEntered = "Niste uneli sve podatke";
                return;
            }

            if (this.workoutType === "solo") {
                this.selectedTrainer.id = -1;
            }
            yourConfig = {
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            const formData = new FormData();
            formData.append("file", this.picture);

            var priceSend = this.price;
            if (priceSend === 0) {
                priceSend = -1;
            }

            axios
                .put(
                    "rest/workout/update",
                    {
                        id: this.odlData.id,
                        name: this.name,
                        workoutType: this.workoutType,
                        facilityId: this.facId,
                        durationInMinutes: this.durationInMinutes,
                        trainerId: this.selectedTrainer.id,
                        description: this.description,
                        price: priceSend,
                    },
                    yourConfig
                )
                .then((response) => {
                    //////////// ovde promeni

                    let id = this.facId;

                    setTimeout(function () {
                        window.location.href = "#/pregledObjekta/" + id;
                    }, 100);
                })
                .catch((error) => {
                    this.alreadyExists =
                        "Već postoji aktivnost sa ovakvim nazivom";
                });
        },
    },
});
