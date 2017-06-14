"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;

    let TeamInstanceMap = new Map();
    let TeamSymbol = new Map();
    const TeamColor = {
        '0': "#fbfbfb",
        '1': "#4f9bff",
        '2': "#ff4f4f",
        '3': "#3cad0f",
        '5': "#ffd34c",
        '4': "#ff4cec",
    };
    Object.freeze(TeamColor);

    const TeamColorDark = {
        '0': "#444444",
        '1': "#001e46",
        '2': "#460000",
        '3': "#154103",
        '4': "#8c009a",
        '5': "#9a5700",
    };
    Object.freeze(TeamColorDark);
    /**
     * Team
     *
     * @class lf2.Team
     */
    lf2.Team = class Team {
        /**
         *
         * @param {Number} teamId
         */
        constructor(teamId) {
            teamId *= 1;
            this._teamId = teamId;
            if (teamId > 0) {
                this._teamSymbol = TeamSymbol.get(teamId) || Symbol(`team_${teamId}`);
                TeamSymbol.set(teamId, this._teamSymbol);
            } else {
                this._teamSymbol = Symbol('team_independent');
            }
        }

        /**
         *
         * @param {lf2.Team} otherTeam
         * @returns {boolean}
         */
        equalsTo(otherTeam) {
            return this._teamSymbol === otherTeam._teamSymbol;
        }

        /**
         * Convert this object into a string representation.
         *
         * @return  An unknown that represents this object.
         */
        toString() {
            if (this._teamId > 0) return `Team ${this._teamId}`;

            return 'Independent';
        }

        /**
         * Gets the color.
         *
         * @return  The color.
         */
        getColor() {
            if (this._teamId > 0) return TeamColor[`${this._teamId}`];

            return TeamColor['0'];
        }

        /**
         * Gets dark color.
         *
         * @return  The dark color.
         */
        getDarkColor() {
            if (this._teamId > 0) return TeamColorDark[`${this._teamId}`];

            return TeamColorDark['0'];
        }

        /**
         * Gets the identifier.
         *
         * @return  {Number}   A get.
         */
        get id() {
            if (this._teamId > 0) return this._teamId;
            return 0;
        }


        /**
         *
         * @param {lf2.Team} t1
         * @param {lf2.Team} t2
         * @returns {boolean}
         */
        static EqualsTo(t1, t2) {
            return t1.equalsTo(t2);
        }

        static GetTeamInstance(teamId) {
            teamId *= 1;
            let oldInstance = TeamInstanceMap.get(teamId);
            if (oldInstance) return oldInstance;

            oldInstance = new Team(teamId);
            if (teamId > 0) TeamInstanceMap.set(teamId, oldInstance);

            return oldInstance;
        }
    };


    return lf2;
})(lf2 || {});