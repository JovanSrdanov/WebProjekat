Vue.component("pregledObjekta", {
    data: function () {
        return {
            allActivitys: {},
            myFacility: false,
            facilityID: null,
            currentFacility: {
                facility: { name: "", logo: "", workStart: "", workEnd: "" },
                location: { address: "" },
            },
            SportFacilityList: {},
            commentsForFacility: {},
            roleCustomer: false,
            roleAdmin: false,
            allComments: false,

            customerCanComment: false,
        };
    },
    template: `  
    <div class="WholeScreen">
            <h1>{{currentFacility.facility.name}}</h1>
            <table class="LogoInfoMap">
                <tr>
                    <td>
                        <img
                            class="LogoPicture"
                            v-bind:src="getImgUrl(currentFacility.facility.logo)"
                            alt="LOGO"
                            height="500px"
                            width="500px"
                        />
                    </td>

                    <td>
                        <p>{{currentFacility.facility.facilityType}}</p>

                        <p>
                            Menadžer: {{currentFacility.managerName}}
                            {{currentFacility.managerSurname}}
                        </p>
                        <p>
                            {{currentFacility.location.street}}
                            {{currentFacility.location.streetNumber}}
                        </p>
                        <p>
                            {{currentFacility.location.city}}
                            {{currentFacility.location.postCode}}
                        </p>
                        <p>
                            ({{currentFacility.location.longitude}},
                            {{currentFacility.location.latitude}})
                        </p>
                        <p>
                            Prosečna ocena:
                            {{currentFacility.facility.rating}}/5
                        </p>
                        <p>
                            Radno vreme: {{currentFacility.facility.workStart}}
                            - {{currentFacility.facility.workEnd}}
                            {{checkStatus(currentFacility.facility.workStart,currentFacility.facility.workEnd)}}
                        </p>
                         <p v-if="myFacility">  
                                <button v-on:click="ViewCustomersAndTrainers">Treneri i kupci</button> 
                                <button v-on:click="SeeHistoryOfTrainings" >Pregled istorije treninga</button>     
                                 </p> 
                          <p v-if="myFacility">  
                                <button v-on:click="AddNewActivity" >Dodaj novi sadržaj</button>     
                                <button  v-on:click="CheckInCustomer" >Prijavi kupca</button>                         
                            </p> 

                            <p ><strong>Ne možete komentarisati i oceniti objekat ako ga niste posetili,</strong></p>
                            <p><strong>ili ako ste ga već komentarisali i ocenili</strong></p>                                      
                             <p v-if="customerCanComment">     
                                    <button v-on:click="CreateComment">Ostavite ocenu i komentar</button>                                           
                            </p> 
                           
                           
                            
                    </td>

                    <td>
                        <div class="mapClass" id="mapShow"></div>
                    </td>
                </tr>
              
            </table>
                           
            <h2 class="white">Sadržaj koji se nudi i komentari korisnika</h2>
            
            <table class="activityAndComments">
              <tr>
                    <td>
                        <div class="Activity">
                            <table>
                                <tbody>
                                    <tr v-for="A in allActivitys">
                                        <td>
                                            <img
                                                v-bind:src="getWorkoutImgUrl(A.workout.picture)"
                                                alt="LOGO"
                                                height="250"
                                                width="250"
                                            />
                                        </td>
                                        <td width="350">
                                            <p>
                                                <strong
                                                    >{{A.workout.name}}
                                                </strong>
                                            </p>
                                            <p>
                                                Tip aktivnosti:
                                                {{TypeConvert(A.workout.workoutType)}}
                                            </p>
                                            <p>
                                                Trajanje:
                                                {{A.workout.durationInMinutes}}
                                            </p>
                                            <p>Doplata: {{getPrice(A.workout.price)}}</p>
                                            <p>
                                                Trener: {{IfTrainer(A.trainer)}}
                                            </p>
                                            <p v-if="myFacility">
                                                <button
                                                    v-on:click="editAcitivity(A.workout.id)"
                                                >
                                                    Izmeni
                                                </button>
                                            </p>

                                             <p v-if="roleCustomer && A.workout.workoutType=='personal' ">
                                                <button    v-on:click="makeAppontiment(A.workout.id)"                                        
                                                >
                                                    Zakaži personalni trening
                                                </button>
                                            </p>

                                              <p v-if="roleAdmin">
                                                <button     class="ObrisiDugme"  v-on:click="OBRISI_AKTIVNOST(A.workout.id)" >Obriši</button>
                                            </p>
                                        </td>

                                        <td width="250">
                                            {{A.workout.description}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>

                    <td>  
                        <div class="tabelaKomentaraZaObjekat">
                            <table>
                                <th>Kupac</th>
                                <th>Tekst</th>
                                <th>Ocena</th>
                                <th v-if="allComments">Odobren / odbijen</th>
                                <th v-if="roleAdmin">Obriši</th>

                                <tbody>
                                    <tr v-for="c in commentsForFacility">
                                        <td>{{c.username}}</td>                                         
                                        <td>{{c.comment.commentText}}</td>
                                        <td>{{c.comment.rating}}</td>    
                                        <td v-if="allComments">{{tralnslateCommentStatus(c.comment.status)}}</td>  
                                        <td v-if="roleAdmin"> <button class="ObrisiDugme"  v-on:click="OBRISI_KOMENTAR(c.comment.id)" >Obriši</button></td>                                               
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                    </td>
                </tr>
            </table>
        </div>
 
                `,

    mounted() {
        this.facilityID = this.$route.params.id;
        yourConfig = {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        };

        if (JSON.parse(localStorage.getItem("loggedInUser")) !== null) {
            if (
                JSON.parse(localStorage.getItem("loggedInUser")).role ===
                "manager"
            ) {
                if (
                    JSON.parse(localStorage.getItem("loggedInUser"))
                        .facilityId == this.facilityID
                ) {
                    this.myFacility = true;
                }
            }
            if (
                JSON.parse(localStorage.getItem("loggedInUser")).role ===
                "customer"
            ) {
                this.roleCustomer = true;
                let c = JSON.parse(localStorage.getItem("loggedInUser"));

                axios
                    .get("rest/comment/can/" + this.facilityID, yourConfig)
                    .then((result) => {
                        this.customerCanComment = result.data;
                    });
            }
        }

        var USER = JSON.parse(localStorage.getItem("loggedInUser"));

        if (USER !== null) {
            if (USER.role == "admin") {
                this.roleAdmin = true;
                this.allComments = true;
                axios
                    .get(
                        "rest/comment/facility/all/" + this.facilityID,
                        yourConfig
                    )
                    .then((result) => {
                        this.commentsForFacility = result.data;
                    });
            } else {
                if (USER.role == "manager") {
                    if (USER.facilityId == this.facilityID) {
                        this.allComments = true;
                        axios
                            .get(
                                "rest/comment/facility/all/" + this.facilityID,
                                yourConfig
                            )
                            .then((result) => {
                                this.commentsForFacility = result.data;
                            });
                    } else {
                        axios
                            .get(
                                "rest/comment/facility/approved/" +
                                    this.facilityID,
                                yourConfig
                            )
                            .then((result) => {
                                this.commentsForFacility = result.data;
                            });
                    }
                } else {
                    axios
                        .get(
                            "rest/comment/facility/approved/" + this.facilityID,
                            yourConfig
                        )
                        .then((result) => {
                            this.commentsForFacility = result.data;
                        });
                }
            }
        } else {
            axios
                .get(
                    "rest/comment/facility/approved/" + this.facilityID,
                    yourConfig
                )
                .then((result) => {
                    this.commentsForFacility = result.data;
                });
        }

        axios.get("rest/facilitys/" + this.facilityID).then((response) => {
            this.currentFacility = response.data;

            var Lon = this.currentFacility.location.longitude;
            var Lat = this.currentFacility.location.latitude;

            var CurrLoaction = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([Lon, Lat])),
            });
            CurrLoaction.setStyle(
                new ol.style.Style({
                    image: new ol.style.Icon(
                        /** @type {olx.style.IconOptions} */ ({
                            color: "red",

                            src: "https://openlayers.org/en/v4.6.5/examples/data/dot.png",
                        })
                    ),
                })
            );
            var vectorSource = new ol.source.Vector({
                features: [CurrLoaction],
            });

            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
            });

            var map = new ol.Map({
                target: "mapShow",
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM(),
                    }),
                    vectorLayer,
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([Lon, Lat]),
                    zoom: 13,
                }),
            });
        });

        yourConfig = {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        };
        axios
            .get("rest/workout/inFacility/" + this.facilityID, yourConfig)
            .then((response) => {
                this.allActivitys = response.data;
            });
    },
    methods: {
        OBRISI_KOMENTAR: function (ID) {
            yourConfig = {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            };
            axios
                .delete("rest/comment/delete/" + ID, yourConfig)
                .then((result) => {
                    alert("Obrisan komentar");

                    this.commentsForFacility = this.commentsForFacility.filter(
                        (data) => data.comment.id != ID
                    );
                })
                .catch((err) => {
                    alert("BAS JAKA GRESKA");
                });
        },
        OBRISI_AKTIVNOST: function (ID) {
            yourConfig = {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            };
            axios
                .delete("rest/workout/delete/" + ID, yourConfig)
                .then((result) => {
                    alert("Obrisana aktivnost");
                    axios
                        .get(
                            "rest/workout/inFacility/" + this.facilityID,
                            yourConfig
                        )
                        .then((response) => {
                            this.allActivitys = response.data;
                        });
                })
                .catch((err) => {
                    alert("BAS JAKA GRESKA");
                });
        },

        CreateComment: function () {
            router.push(`/pregledObjekta/${this.facilityID}/ostaviKomentar/`);
        },

        tralnslateCommentStatus: function (status) {
            if (status === "approved") return "Odobren";
            if (status === "waiting") return "Čeka";
            if (status === "rejected") return "Odbijen";

            return "Greska";
        },

        getPrice: function (price) {
            if (price == -1) return "Nema doplate";
            return price + " RSD";
        },
        TypeConvert: function (type) {
            if (type === "personal") return "Personalni trening";
            if (type === "group") return "Grupni trening";
            if (type === "solo") return "Aktivnost bez trenera";

            return "Greska";
        },
        makeAppontiment: function (id) {
            router.push(
                `/pregledObjekta/${this.facilityID}/zakaziTrening/${id}`
            );
        },

        editAcitivity: function (id) {
            router.push(
                `/pregledObjekta/${this.facilityID}/izmeniAktivnost/${id}`
            );
        },
        IfTrainer: function (trainer) {
            if (!trainer) return "Nema trenera";
            return trainer.name + " " + trainer.surname;
        },

        ViewCustomersAndTrainers: function () {
            router.push(`/pregledObjekta/${this.facilityID}/treneriIkupci`);
        },
        AddNewActivity: function () {
            router.push(`/pregledObjekta/${this.facilityID}/dodajAktivnost`);
        },
        CheckInCustomer: function () {
            router.push(
                `/pregledObjekta/${this.facilityID}/prijaviKupcaNaAktivnost`
            );
        },
        SeeHistoryOfTrainings: function () {
            router.push(
                `/pregledObjekta/${this.facilityID}/istorijaAktivnostiUObjektu`
            );
        },
        checkStatus(start, end) {
            var today = new Date();

            var workDayStartTime = new Date();
            var workDayEndTime = new Date();

            if (parseInt(start.split(":")[0]) > parseInt(end.split(":")[0])) {
                workDayEndTime.setDate(workDayEndTime.getDate() + 1);
            }

            workDayStartTime.setHours(parseInt(start.split(":")[0]));
            workDayStartTime.setMinutes(parseInt(start.split(":")[1]));

            workDayEndTime.setHours(parseInt(end.split(":")[0]));
            workDayEndTime.setMinutes(parseInt(end.split(":")[1]));

            if (workDayStartTime < today && workDayEndTime > today) {
                return "(Radi)";
            } else {
                return "(Ne radi)";
            }
        },
        convertStatus(status) {
            if (status) return "radi";
            else return "ne radi";
        },
        getImgUrl(slika) {
            if (slika == "") return null;
            return "FacilityLogo/" + slika;
        },
        getWorkoutImgUrl(slika) {
            if (slika == "") return null;
            return "ActivityPictures/" + slika;
        },
    },
});
