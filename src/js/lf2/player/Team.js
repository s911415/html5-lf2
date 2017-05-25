"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;

    let TeamInstanceMap = new Map();
    let TeamSymbol = new Map();
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

        toString() {
            if (this._teamId > 0) return `Team ${this._teamId}`;

            return 'Independent';
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
            TeamInstanceMap.set(teamId, oldInstance);

            return oldInstance;
        }
    };


    return lf2;
})(lf2 || {});