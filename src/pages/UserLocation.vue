<template>
    <div>
        <section class="ui two column centered grid" style="position:relative;z-index: 1;">
            <div class="column">
                <form action="" class="ui segment large form">
                    <div class="ui message red" v-show="error">{{ error }}</div>
                    <div class="ui segment">
                        <div class="field">
                            <div class="ui right icon input large" :class="{ loading: spinner }">
                                <input type="text" placeholder="Enter your address" v-model="address" id="autocomplete" />
                                <i class="dot circle link icon" @click="locatorButtonPressed" style="cursor: pointer"></i>
                            </div>
                        </div>
                    </div>
                    <button class="ui button">Go</button>
                </form>
            </div>
        </section>
        <section id="map"></section>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "UserLocation",
    data() {
        return {
            address: "",
            error: "",
            spinner: false,
        };
    },
    mounted() {
        let autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"), {
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(29.0940, 37.0488),
            ),
        });
        autocomplete.addListener("place_changed", () => {
            let place = autocomplete.getPlace();
            console.log(place);
            this.showUserLocationOnTheMap(place.geomatry.location.lat() , place.geomatry.location.lng())
        });
    },
    methods: {
        locatorButtonPressed() {
            this.spinner = true;
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.getAddressFrom(position.coords.latitude, position.coords.longitude);
                        this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude)
                    },
                    error => {
                        this.error = "Location is unable to find your address. Please type your address manually!";
                        this.spinner = false;
                    }
                );
            } else {
                this.error = "Your browser does not support the Geolocation API.";
                this.spinner = false;
            }
        },
        getAddressFrom(lat, long) {
            axios
                .get(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=YOUR_API_KEY`
                )
                .then((response) => {
                    if (response.data.error_message) {
                        this.error = response.data.error_message;
                    } else if (response.data.results && response.data.results.length > 0) {
                        this.address = response.data.results[0].formatted_address;
                    } else {
                        this.error = "No address found for this location.";
                    }
                    this.spinner = false;
                })
                .catch((error) => {
                    this.error = error.message;
                    this.spinner = false;
                });
        },
        showUserLocationOnTheMap(latitude, longitude) {
            // create a map object
            let map = new google.maps.Map(document.getElementById("map"), {
                zoom:15,
                center: new google.maps.LatLng(latitude, longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            });

            // add marker
            new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map: map,
            });
        }
    },
};
</script>

<style>
.ui.button,
.dot.circle.icon {
    background-color: #ff5a5f;
    color: #fff;
}

.pac-icon {
    display: none;
}
.pac-item {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
}
.pac-item:hover {
    background-color: #ececec;
}

#map{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgb(119, 119, 119);
}
</style>
