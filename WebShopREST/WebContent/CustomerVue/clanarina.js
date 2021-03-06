Vue.component("clanarina", {
    data: function () {
        return {
            customer: { points: "" },

            staraClanarina: {},
            selectedBase: { code: "", price: 0, priceMultiplicator: 0 },
            baseMemberships: {},
            hasMembership: false,
            NeogranicenoCheck: false,
            dailyActivty: 5,
            promoCodeEnter: "",
            promoCodeMessage: "",
            promoCodeDiscount: -1,
            isVerified: false,
            lastVerifiedPromoCode: "",
            statusFix: "",

            typeName: "",

            popust: "",
        };
    },
    template: ` 
  <div>
            <h1>Clanarine</h1>
            <p class="white">
                Tip kupca: {{translateType(typeName)}} - Broj bodova: {{customer.points}} - Popust koji se nudi: {{popust}}%
            </p>

            <div class="CreateMembership">
               
                <table style="margin: auto">
                    <tr>
                        <td>
                            <div class="WrapTextEnterData">
                                <p>Unesite podatke:</p>
                                <p>Izabrali ste članarinu: {{selectedBase.code}}</p>

                                <p>
                                    Broj dnevnih aktivnosti:
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        name="promoCode"
                                        id="promoCode"
                                        v-model="dailyActivty"
                                    />
                                </p>
                                <p
                                    style="
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                    "
                                >
                                    <input
                                        class="checkbox"
                                        type="checkbox"
                                        v-model="NeogranicenoCheck"
                                    />

                                    <label for="checkbox"
                                        >Neogranicen broj aktivnosti</label
                                    >
                                </p>
                                <input
                                    type="text"
                                    name="promoCode"
                                    id="promoCode"
                                    v-model="promoCodeEnter"
                                    placeholder="Uneti promo kod"
                                />
                                <button v-on:click="verifyPromoCode">Verifikuj kod</button>
                                <p>Promo kod je: {{promoCodeMessage}}</p>
                                <p>Popust koji kod nudi: {{promoCodeComputed}}</p>

                                <p>
                                    Konačna cena: {{priceComputed}}
                                    <button v-on:click="CreateClanarina">Potvrdi članarinu</button>
                                </p>
                            </div >
                        </td>

                        <td>
                            <h3 class="white">Dostupne članarine</h3>
                            <table class="BaseMTable">
                                <th>Kod članarine</th>
                                <th>Tip članarine (broj dana važenja)</th>
                                <th>Početna cena</th>
                                <th>Multiplikator cene</th>

                                <tbody>
                                    <tr v-for="B in baseMemberships"  v-on:click="selectClanarinabase(B)"
                                    v-bind:class="{selectedBaseClass : selectedBase.id===B.id}">
                                        <td>{{B.code}}</td>
                                        <td>{{B.durationDays}}</td>
                                        <td>{{B.price}}</td>
                                        <td>{{B.priceMultiplicator}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>

            <div v-if="hasMembership" class="WrapTextClanarina">
                <h2>Stara clanarina</h2>
                <p>Kod članarine: {{staraClanarina.code}}</p>
                <p>
                    Datum kreiranja članarine:
                    {{getDate(staraClanarina.startDate)}}
                </p>
                <p>
                    Datum prestanka važenja: {{getDate(staraClanarina.endDate)}}
                </p>
                <p>Cena: {{staraClanarina.price}} RSD</p>
                <p>Status: {{statusFix}}</p>
                <p>
                    Dnevni broj dozvoljenjih aktivnost :
                    {{convertDA(staraClanarina.numberOfTrainings)}}
                </p>
            </div>
        </div>
      
    
    `,
    mounted() {
        yourConfig = {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        };
        if (JSON.parse(localStorage.getItem("loggedInUser")) === null) {
            alert("Nemate pristup ovom sadržaju");
            window.location.href = "#/pocetna";
            return;
        }
        if (
            JSON.parse(localStorage.getItem("loggedInUser")).role != "customer"
        ) {
            alert("Nemate pristup ovom sadržaju");
            window.location.href = "#/pocetna";
            return;
        }

        this.customer = JSON.parse(localStorage.getItem("loggedInUser"));

        if (this.customer.membershipId != -1) {
            this.hasMembership = true;

            axios
                .get("rest/membership/customer/" + this.customer.id, yourConfig)
                .then((result) => {
                    this.staraClanarina = result.data;

                    if (this.staraClanarina.active) {
                        this.statusFix = "Aktivna";
                    } else {
                        this.statusFix = "Nije aktivna";
                    }
                });
        }

        axios.get("rest/membership/base").then((result) => {
            this.baseMemberships = result.data;
        });

        axios.get("rest/customer/type", yourConfig).then((result) => {
            this.typeCustomer = result.data;
            this.popust = (1 - this.typeCustomer.discount) * 100;
            this.typeName = this.typeCustomer.typeName;
        });
    },

    computed: {
        promoCodeComputed() {
            if (this.promoCodeDiscount == -1)
                return "Niste uneli kod ili on nije validan";
            return this.promoCodeDiscount + "%";
        },
        priceComputed() {
            if (this.selectedBase.code === "") return 0;

            let forComputePromoCode = this.promoCodeDiscount;
            let forComputeDailyActivity = this.dailyActivty;
            let forComputePriceMulti = this.selectedBase.priceMultiplicator;
            let forStartPrice = this.selectedBase.price;

            let POPUSTODTIPAKUPCA = this.typeCustomer.discount;

            console.log("FCPC " + forComputePromoCode);
            if (forComputePromoCode == -1) {
                forComputePromoCode = 1;
            } else {
                forComputePromoCode = forComputePromoCode / 100;
            }
            if (this.NeogranicenoCheck) {
                forComputeDailyActivity = 11;
            }
            if (forComputeDailyActivity == 1) {
                forComputePriceMulti = 1;
            }
            return Math.round(
                forComputePromoCode *
                    forComputeDailyActivity *
                    forComputePriceMulti *
                    forStartPrice *
                    POPUSTODTIPAKUPCA
            );
        },
    },
    methods: {
        convertDA(nt) {
            if (nt == -1) return "Neograničeno";
            return nt;
        },
        verifyPromoCode() {
            yourConfig = {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            };

            this.lastVerifiedPromoCode = this.promoCodeEnter;
            axios
                .get("rest/promoCode/valid/" + this.promoCodeEnter, yourConfig)
                .then((response) => {
                    this.promoCodeDiscount = response.data;
                    if (response.data == -1) {
                        this.isVerified = false;

                        this.promoCodeMessage =
                            " nije validan (" +
                            this.lastVerifiedPromoCode +
                            ")";
                    } else {
                        this.isVerified = true;

                        this.promoCodeMessage =
                            " validan (" + this.lastVerifiedPromoCode + ")";
                    }
                });
        },
        CreateClanarina: function () {
            if (isNaN(this.dailyActivty)) {
                alert("Unestite brojcanu vrednost broja dnevnih aktivnost");
                return;
            }
            if (
                (this.dailyActivty < 1 || this.dailyActivty > 10) &&
                !this.NeogranicenoCheck
            ) {
                alert(
                    "Unestite validan broj dnevnih aktivnosti (1-10) ili odaberite neograničeno"
                );
                return;
            }

            if (this.selectedBase.code == "") {
                alert("Izaberite osnovu clanarine");
                return;
            }
            const params = new URLSearchParams();

            var promoCodeVar = this.lastVerifiedPromoCode;
            if (!this.isVerified) {
                promoCodeVar = "";
            }

            var dayAct = this.dailyActivty;

            if (this.NeogranicenoCheck) {
                dayAct = -1;
            }

            console.log(promoCodeVar);
            params.append("code", this.selectedBase.code);
            params.append("perDay", dayAct);
            params.append("promoCode", promoCodeVar);

            axios
                .post("rest/membership/newMembership", params, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                })
                .then((response) => {
                    this.$root.VarToken();
                })
                .catch((error) => {
                    alert("Greska ");
                });
        },
        convertStatus(status) {
            console.log("status " + status);
            if (this.staraClanarina.status) return "Aktivna";
            return "Nije aktivna";
        },
        translateType: function (type) {
            switch (type) {
                case "Bronze":
                    return "Bronzani";
                case "Silver":
                    return "Srebrni";
                case "Gold":
                    return "Zlatni";

                default:
                    return type;
            }
        },
        getDate: function (milliseconds) {
            const d = new Date();
            d.setTime(milliseconds);
            return d.toLocaleDateString("sr-RS");
        },

        selectClanarinabase(base) {
            this.selectedBase = base;
        },
    },
});
