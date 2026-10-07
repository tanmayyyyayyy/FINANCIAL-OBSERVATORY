//#region node_modules/@firebase/util/dist/postinstall.mjs
var e = () => void 0, t = function(e) {
	let t = [], n = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e.charCodeAt(r);
		i < 128 ? t[n++] = i : i < 2048 ? (t[n++] = i >> 6 | 192, t[n++] = i & 63 | 128) : (i & 64512) == 55296 && r + 1 < e.length && (e.charCodeAt(r + 1) & 64512) == 56320 ? (i = 65536 + ((i & 1023) << 10) + (e.charCodeAt(++r) & 1023), t[n++] = i >> 18 | 240, t[n++] = i >> 12 & 63 | 128, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128) : (t[n++] = i >> 12 | 224, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128);
	}
	return t;
}, n = function(e) {
	let t = [], n = 0, r = 0;
	for (; n < e.length;) {
		let i = e[n++];
		if (i < 128) t[r++] = String.fromCharCode(i);
		else if (i > 191 && i < 224) {
			let a = e[n++];
			t[r++] = String.fromCharCode((i & 31) << 6 | a & 63);
		} else if (i > 239 && i < 365) {
			let a = e[n++], o = e[n++], s = e[n++], c = ((i & 7) << 18 | (a & 63) << 12 | (o & 63) << 6 | s & 63) - 65536;
			t[r++] = String.fromCharCode(55296 + (c >> 10)), t[r++] = String.fromCharCode(56320 + (c & 1023));
		} else {
			let a = e[n++], o = e[n++];
			t[r++] = String.fromCharCode((i & 15) << 12 | (a & 63) << 6 | o & 63);
		}
	}
	return t.join("");
}, r = {
	byteToCharMap_: null,
	charToByteMap_: null,
	byteToCharMapWebSafe_: null,
	charToByteMapWebSafe_: null,
	ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
	get ENCODED_VALS() {
		return this.ENCODED_VALS_BASE + "+/=";
	},
	get ENCODED_VALS_WEBSAFE() {
		return this.ENCODED_VALS_BASE + "-_.";
	},
	HAS_NATIVE_SUPPORT: typeof atob == "function",
	encodeByteArray(e, t) {
		if (!Array.isArray(e)) throw Error("encodeByteArray takes an array as a parameter");
		this.init_();
		let n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_, r = [];
		for (let t = 0; t < e.length; t += 3) {
			let i = e[t], a = t + 1 < e.length, o = a ? e[t + 1] : 0, s = t + 2 < e.length, c = s ? e[t + 2] : 0, l = i >> 2, u = (i & 3) << 4 | o >> 4, d = (o & 15) << 2 | c >> 6, f = c & 63;
			s || (f = 64, a || (d = 64)), r.push(n[l], n[u], n[d], n[f]);
		}
		return r.join("");
	},
	encodeString(e, n) {
		return this.HAS_NATIVE_SUPPORT && !n ? btoa(e) : this.encodeByteArray(t(e), n);
	},
	decodeString(e, t) {
		return this.HAS_NATIVE_SUPPORT && !t ? atob(e) : n(this.decodeStringToByteArray(e, t));
	},
	decodeStringToByteArray(e, t) {
		this.init_();
		let n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_, r = [];
		for (let t = 0; t < e.length;) {
			let a = n[e.charAt(t++)], o = t < e.length ? n[e.charAt(t)] : 0;
			++t;
			let s = t < e.length ? n[e.charAt(t)] : 64;
			++t;
			let c = t < e.length ? n[e.charAt(t)] : 64;
			if (++t, a == null || o == null || s == null || c == null) throw new i();
			let l = a << 2 | o >> 4;
			if (r.push(l), s !== 64) {
				let e = o << 4 & 240 | s >> 2;
				if (r.push(e), c !== 64) {
					let e = s << 6 & 192 | c;
					r.push(e);
				}
			}
		}
		return r;
	},
	init_() {
		if (!this.byteToCharMap_) {
			this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
			for (let e = 0; e < this.ENCODED_VALS.length; e++) this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e), this.charToByteMap_[this.byteToCharMap_[e]] = e, this.byteToCharMapWebSafe_[e] = this.ENCODED_VALS_WEBSAFE.charAt(e), this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e, e >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e);
		}
	}
}, i = class extends Error {
	constructor() {
		super(...arguments), this.name = "DecodeBase64StringError";
	}
}, a = function(e) {
	let n = t(e);
	return r.encodeByteArray(n, !0);
}, o = function(e) {
	return a(e).replace(/\./g, "");
}, s = function(e) {
	try {
		return r.decodeString(e, !0);
	} catch (e) {
		console.error("base64Decode failed: ", e);
	}
	return null;
};
function c() {
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("Unable to locate global object.");
}
var l = () => c().__FIREBASE_DEFAULTS__, u = () => {
	if (typeof process > "u" || process.env === void 0) return;
	let e = process.env.__FIREBASE_DEFAULTS__;
	if (e) return JSON.parse(e);
}, d = () => {
	if (typeof document > "u") return;
	let e;
	try {
		e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
	} catch {
		return;
	}
	let t = e && s(e[1]);
	return t && JSON.parse(t);
}, f = () => {
	try {
		return e() || l() || u() || d();
	} catch (e) {
		console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
		return;
	}
}, p = (e) => f()?.emulatorHosts?.[e], m = (e) => {
	let t = p(e);
	if (!t) return;
	let n = t.lastIndexOf(":");
	if (n <= 0 || n + 1 === t.length) throw Error(`Invalid host ${t} with no separate hostname and port!`);
	let r = parseInt(t.substring(n + 1), 10);
	return t[0] === "[" ? [t.substring(1, n - 1), r] : [t.substring(0, n), r];
}, h = () => f()?.config, g = (e) => f()?.[`_${e}`], _ = class {
	constructor() {
		this.reject = () => {}, this.resolve = () => {}, this.promise = new Promise((e, t) => {
			this.resolve = e, this.reject = t;
		});
	}
	wrapCallback(e) {
		return (t, n) => {
			t ? this.reject(t) : this.resolve(n), typeof e == "function" && (this.promise.catch(() => {}), e.length === 1 ? e(t) : e(t, n));
		};
	}
};
function ee(e, t) {
	if (e.uid) throw Error("The \"uid\" field is no longer supported by mockUserToken. Please use \"sub\" instead for Firebase Auth User ID.");
	let n = {
		alg: "none",
		type: "JWT"
	}, r = t || "demo-project", i = e.iat || 0, a = e.sub || e.user_id;
	if (!a) throw Error("mockUserToken must contain 'sub' or 'user_id' field!");
	let s = {
		iss: `https://securetoken.google.com/${r}`,
		aud: r,
		iat: i,
		exp: i + 3600,
		auth_time: i,
		sub: a,
		user_id: a,
		firebase: {
			sign_in_provider: "custom",
			identities: {}
		},
		...e
	};
	return [
		o(JSON.stringify(n)),
		o(JSON.stringify(s)),
		""
	].join(".");
}
function v() {
	return typeof navigator < "u" && typeof navigator.userAgent == "string" ? navigator.userAgent : "";
}
function te() {
	return typeof window < "u" && !!(window.cordova || window.phonegap || window.PhoneGap) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(v());
}
function ne() {
	let e = f()?.forceEnvironment;
	if (e === "node") return !0;
	if (e === "browser") return !1;
	try {
		return Object.prototype.toString.call(global.process) === "[object process]";
	} catch {
		return !1;
	}
}
function re() {
	return typeof navigator < "u" && navigator.userAgent === "Cloudflare-Workers";
}
function ie() {
	let e = typeof chrome == "object" ? chrome.runtime : typeof browser == "object" ? browser.runtime : void 0;
	return typeof e == "object" && e.id !== void 0;
}
function ae() {
	return typeof navigator == "object" && navigator.product === "ReactNative";
}
function oe() {
	let e = v();
	return e.indexOf("MSIE ") >= 0 || e.indexOf("Trident/") >= 0;
}
function se() {
	return !ne() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
}
function ce() {
	try {
		return typeof indexedDB == "object";
	} catch {
		return !1;
	}
}
function le() {
	return new Promise((e, t) => {
		try {
			let n = !0, r = "validate-browser-context-for-indexeddb-analytics-module", i = self.indexedDB.open(r);
			i.onsuccess = () => {
				i.result.close(), n || self.indexedDB.deleteDatabase(r), e(!0);
			}, i.onupgradeneeded = () => {
				n = !1;
			}, i.onerror = () => {
				t(i.error?.message || "");
			};
		} catch (e) {
			t(e);
		}
	});
}
var ue = "FirebaseError", de = class e extends Error {
	constructor(t, n, r) {
		super(n), this.code = t, this.customData = r, this.name = ue, Object.setPrototypeOf(this, e.prototype), Error.captureStackTrace && Error.captureStackTrace(this, fe.prototype.create);
	}
}, fe = class {
	constructor(e, t, n) {
		this.service = e, this.serviceName = t, this.errors = n;
	}
	create(e, ...t) {
		let n = t[0] || {}, r = `${this.service}/${e}`, i = this.errors[e], a = i ? pe(i, n) : "Error";
		return new de(r, `${this.serviceName}: ${a} (${r}).`, n);
	}
};
function pe(e, t) {
	try {
		let n = 0, r = "";
		for (; n < e.length;) {
			let i = e.indexOf("{$", n);
			if (i === -1) {
				r += e.substring(n);
				break;
			}
			let a = e.indexOf("}", i + 2);
			if (a === -1) {
				r += e.substring(n);
				break;
			}
			let o = e.substring(i + 2, a), s = t[o];
			r += e.substring(n, i) + (s == null ? `<${o}?>` : String(s)), n = a + 1;
		}
		return r;
	} catch {
		return e;
	}
}
function me(e) {
	for (let t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
	return !0;
}
function he(e, t) {
	if (e === t) return !0;
	let n = Object.keys(e), r = Object.keys(t);
	for (let i of n) {
		if (!r.includes(i)) return !1;
		let n = e[i], a = t[i];
		if (ge(n) && ge(a)) {
			if (!he(n, a)) return !1;
		} else if (n !== a) return !1;
	}
	for (let e of r) if (!n.includes(e)) return !1;
	return !0;
}
function ge(e) {
	return typeof e == "object" && !!e;
}
function _e(e) {
	let t = [];
	for (let [n, r] of Object.entries(e)) Array.isArray(r) ? r.forEach((e) => {
		t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e));
	}) : t.push(encodeURIComponent(n) + "=" + encodeURIComponent(r));
	return t.length ? "&" + t.join("&") : "";
}
function ve(e) {
	let t = {};
	return e.replace(/^\?/, "").split("&").forEach((e) => {
		if (e) {
			let [n, r] = e.split("=");
			t[decodeURIComponent(n)] = decodeURIComponent(r);
		}
	}), t;
}
function ye(e) {
	let t = e.indexOf("?");
	if (!t) return "";
	let n = e.indexOf("#", t);
	return e.substring(t, n > 0 ? n : void 0);
}
function be(e, t) {
	let n = new xe(e, t);
	return n.subscribe.bind(n);
}
var xe = class {
	constructor(e, t) {
		this.observers = [], this.unsubscribes = [], this.observerCount = 0, this.task = Promise.resolve(), this.finalized = !1, this.onNoObservers = t, this.task.then(() => {
			e(this);
		}).catch((e) => {
			this.error(e);
		});
	}
	next(e) {
		this.forEachObserver((t) => {
			t.next(e);
		});
	}
	error(e) {
		this.forEachObserver((t) => {
			t.error(e);
		}), this.close(e);
	}
	complete() {
		this.forEachObserver((e) => {
			e.complete();
		}), this.close();
	}
	subscribe(e, t, n) {
		let r;
		if (e === void 0 && t === void 0 && n === void 0) throw Error("Missing Observer.");
		r = Se(e, [
			"next",
			"error",
			"complete"
		]) ? e : {
			next: e,
			error: t,
			complete: n
		}, r.next === void 0 && (r.next = Ce), r.error === void 0 && (r.error = Ce), r.complete === void 0 && (r.complete = Ce);
		let i = this.unsubscribeOne.bind(this, this.observers.length);
		return this.finalized && this.task.then(() => {
			try {
				this.finalError ? r.error(this.finalError) : r.complete();
			} catch {}
		}), this.observers.push(r), i;
	}
	unsubscribeOne(e) {
		this.observers !== void 0 && this.observers[e] !== void 0 && (delete this.observers[e], --this.observerCount, this.observerCount === 0 && this.onNoObservers !== void 0 && this.onNoObservers(this));
	}
	forEachObserver(e) {
		if (!this.finalized) for (let t = 0; t < this.observers.length; t++) this.sendOne(t, e);
	}
	sendOne(e, t) {
		this.task.then(() => {
			if (this.observers !== void 0 && this.observers[e] !== void 0) try {
				t(this.observers[e]);
			} catch (e) {
				typeof console < "u" && console.error && console.error(e);
			}
		});
	}
	close(e) {
		this.finalized || (this.finalized = !0, e !== void 0 && (this.finalError = e), this.task.then(() => {
			this.observers = void 0, this.onNoObservers = void 0;
		}));
	}
};
function Se(e, t) {
	if (typeof e != "object" || !e) return !1;
	for (let n of t) if (n in e && typeof e[n] == "function") return !0;
	return !1;
}
function Ce() {}
function we(e) {
	return e && e._delegate ? e._delegate : e;
}
function Te(e) {
	try {
		return (e.startsWith("http://") || e.startsWith("https://") ? new URL(e).hostname : e).endsWith(".cloudworkstations.dev");
	} catch {
		return !1;
	}
}
async function Ee(e) {
	return (await fetch(e, { credentials: "include" })).ok;
}
//#endregion
//#region node_modules/@firebase/component/dist/esm/index.esm.js
var De = class {
	constructor(e, t, n) {
		this.name = e, this.instanceFactory = t, this.type = n, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = "LAZY", this.onInstanceCreated = null;
	}
	setInstantiationMode(e) {
		return this.instantiationMode = e, this;
	}
	setMultipleInstances(e) {
		return this.multipleInstances = e, this;
	}
	setServiceProps(e) {
		return this.serviceProps = e, this;
	}
	setInstanceCreatedCallback(e) {
		return this.onInstanceCreated = e, this;
	}
}, Oe = "[DEFAULT]", ke = class {
	constructor(e, t) {
		this.name = e, this.container = t, this.component = null, this.instances = /* @__PURE__ */ new Map(), this.instancesDeferred = /* @__PURE__ */ new Map(), this.instancesOptions = /* @__PURE__ */ new Map(), this.onInitCallbacks = /* @__PURE__ */ new Map();
	}
	get(e) {
		let t = this.normalizeInstanceIdentifier(e);
		if (!this.instancesDeferred.has(t)) {
			let e = new _();
			if (this.instancesDeferred.set(t, e), this.isInitialized(t) || this.shouldAutoInitialize()) try {
				let n = this.getOrInitializeService({ instanceIdentifier: t });
				n && e.resolve(n);
			} catch {}
		}
		return this.instancesDeferred.get(t).promise;
	}
	getImmediate(e) {
		let t = this.normalizeInstanceIdentifier(e?.identifier), n = e?.optional ?? !1;
		if (this.isInitialized(t) || this.shouldAutoInitialize()) try {
			return this.getOrInitializeService({ instanceIdentifier: t });
		} catch (e) {
			if (n) return null;
			throw e;
		}
		if (n) return null;
		throw Error(`Service ${this.name} is not available`);
	}
	getComponent() {
		return this.component;
	}
	setComponent(e) {
		if (e.name !== this.name) throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
		if (this.component) throw Error(`Component for ${this.name} has already been provided`);
		if (this.component = e, this.shouldAutoInitialize()) {
			if (je(e)) try {
				this.getOrInitializeService({ instanceIdentifier: Oe });
			} catch {}
			for (let [e, t] of this.instancesDeferred.entries()) {
				let n = this.normalizeInstanceIdentifier(e);
				try {
					let e = this.getOrInitializeService({ instanceIdentifier: n });
					t.resolve(e);
				} catch {}
			}
		}
	}
	clearInstance(e = Oe) {
		this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e);
	}
	async delete() {
		let e = Array.from(this.instances.values());
		await Promise.all([...e.filter((e) => "INTERNAL" in e).map((e) => e.INTERNAL.delete()), ...e.filter((e) => "_delete" in e).map((e) => e._delete())]);
	}
	isComponentSet() {
		return this.component != null;
	}
	isInitialized(e = Oe) {
		return this.instances.has(e);
	}
	getOptions(e = Oe) {
		return this.instancesOptions.get(e) || {};
	}
	initialize(e = {}) {
		let { options: t = {} } = e, n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
		if (this.isInitialized(n)) throw Error(`${this.name}(${n}) has already been initialized`);
		if (!this.isComponentSet()) throw Error(`Component ${this.name} has not been registered yet`);
		let r = this.getOrInitializeService({
			instanceIdentifier: n,
			options: t
		});
		for (let [e, t] of this.instancesDeferred.entries()) n === this.normalizeInstanceIdentifier(e) && t.resolve(r);
		return r;
	}
	onInit(e, t) {
		let n = this.normalizeInstanceIdentifier(t), r = this.onInitCallbacks.get(n) ?? /* @__PURE__ */ new Set();
		r.add(e), this.onInitCallbacks.set(n, r);
		let i = this.instances.get(n);
		return i && e(i, n), () => {
			r.delete(e);
		};
	}
	invokeOnInitCallbacks(e, t) {
		let n = this.onInitCallbacks.get(t);
		if (n) for (let r of n) try {
			r(e, t);
		} catch {}
	}
	getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
		let n = this.instances.get(e);
		if (!n && this.component && (n = this.component.instanceFactory(this.container, {
			instanceIdentifier: Ae(e),
			options: t
		}), this.instances.set(e, n), this.instancesOptions.set(e, t), this.invokeOnInitCallbacks(n, e), this.component.onInstanceCreated)) try {
			this.component.onInstanceCreated(this.container, e, n);
		} catch {}
		return n || null;
	}
	normalizeInstanceIdentifier(e = Oe) {
		return this.component ? this.component.multipleInstances ? e : Oe : e;
	}
	shouldAutoInitialize() {
		return !!this.component && this.component.instantiationMode !== "EXPLICIT";
	}
};
function Ae(e) {
	return e === Oe ? void 0 : e;
}
function je(e) {
	return e.instantiationMode === "EAGER";
}
var Me = class {
	constructor(e) {
		this.name = e, this.providers = /* @__PURE__ */ new Map();
	}
	addComponent(e) {
		let t = this.getProvider(e.name);
		if (t.isComponentSet()) throw Error(`Component ${e.name} has already been registered with ${this.name}`);
		t.setComponent(e);
	}
	addOrOverwriteComponent(e) {
		this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name), this.addComponent(e);
	}
	getProvider(e) {
		if (this.providers.has(e)) return this.providers.get(e);
		let t = new ke(e, this);
		return this.providers.set(e, t), t;
	}
	getProviders() {
		return Array.from(this.providers.values());
	}
}, Ne = [], y;
(function(e) {
	e[e.DEBUG = 0] = "DEBUG", e[e.VERBOSE = 1] = "VERBOSE", e[e.INFO = 2] = "INFO", e[e.WARN = 3] = "WARN", e[e.ERROR = 4] = "ERROR", e[e.SILENT = 5] = "SILENT";
})(y ||= {});
var Pe = {
	debug: y.DEBUG,
	verbose: y.VERBOSE,
	info: y.INFO,
	warn: y.WARN,
	error: y.ERROR,
	silent: y.SILENT
}, Fe = y.INFO, Ie = {
	[y.DEBUG]: "log",
	[y.VERBOSE]: "log",
	[y.INFO]: "info",
	[y.WARN]: "warn",
	[y.ERROR]: "error"
}, Le = (e, t, ...n) => {
	if (t < e.logLevel) return;
	let r = (/* @__PURE__ */ new Date()).toISOString(), i = Ie[t];
	if (i) console[i](`[${r}]  ${e.name}:`, ...n);
	else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`);
}, Re = class {
	constructor(e) {
		this.name = e, this._logLevel = Fe, this._logHandler = Le, this._userLogHandler = null, Ne.push(this);
	}
	get logLevel() {
		return this._logLevel;
	}
	set logLevel(e) {
		if (!(e in y)) throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
		this._logLevel = e;
	}
	setLogLevel(e) {
		this._logLevel = typeof e == "string" ? Pe[e] : e;
	}
	get logHandler() {
		return this._logHandler;
	}
	set logHandler(e) {
		if (typeof e != "function") throw TypeError("Value assigned to `logHandler` must be a function");
		this._logHandler = e;
	}
	get userLogHandler() {
		return this._userLogHandler;
	}
	set userLogHandler(e) {
		this._userLogHandler = e;
	}
	debug(...e) {
		this._userLogHandler && this._userLogHandler(this, y.DEBUG, ...e), this._logHandler(this, y.DEBUG, ...e);
	}
	log(...e) {
		this._userLogHandler && this._userLogHandler(this, y.VERBOSE, ...e), this._logHandler(this, y.VERBOSE, ...e);
	}
	info(...e) {
		this._userLogHandler && this._userLogHandler(this, y.INFO, ...e), this._logHandler(this, y.INFO, ...e);
	}
	warn(...e) {
		this._userLogHandler && this._userLogHandler(this, y.WARN, ...e), this._logHandler(this, y.WARN, ...e);
	}
	error(...e) {
		this._userLogHandler && this._userLogHandler(this, y.ERROR, ...e), this._logHandler(this, y.ERROR, ...e);
	}
}, ze = (e, t) => t.some((t) => e instanceof t), Be, Ve;
function He() {
	return Be ||= [
		IDBDatabase,
		IDBObjectStore,
		IDBIndex,
		IDBCursor,
		IDBTransaction
	];
}
function Ue() {
	return Ve ||= [
		IDBCursor.prototype.advance,
		IDBCursor.prototype.continue,
		IDBCursor.prototype.continuePrimaryKey
	];
}
var We = /* @__PURE__ */ new WeakMap(), Ge = /* @__PURE__ */ new WeakMap(), Ke = /* @__PURE__ */ new WeakMap(), qe = /* @__PURE__ */ new WeakMap(), Je = /* @__PURE__ */ new WeakMap();
function Ye(e) {
	let t = new Promise((t, n) => {
		let r = () => {
			e.removeEventListener("success", i), e.removeEventListener("error", a);
		}, i = () => {
			t(tt(e.result)), r();
		}, a = () => {
			n(e.error), r();
		};
		e.addEventListener("success", i), e.addEventListener("error", a);
	});
	return t.then((t) => {
		t instanceof IDBCursor && We.set(t, e);
	}).catch(() => {}), Je.set(t, e), t;
}
function Xe(e) {
	if (Ge.has(e)) return;
	let t = new Promise((t, n) => {
		let r = () => {
			e.removeEventListener("complete", i), e.removeEventListener("error", a), e.removeEventListener("abort", a);
		}, i = () => {
			t(), r();
		}, a = () => {
			n(e.error || new DOMException("AbortError", "AbortError")), r();
		};
		e.addEventListener("complete", i), e.addEventListener("error", a), e.addEventListener("abort", a);
	});
	Ge.set(e, t);
}
var Ze = {
	get(e, t, n) {
		if (e instanceof IDBTransaction) {
			if (t === "done") return Ge.get(e);
			if (t === "objectStoreNames") return e.objectStoreNames || Ke.get(e);
			if (t === "store") return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
		}
		return tt(e[t]);
	},
	set(e, t, n) {
		return e[t] = n, !0;
	},
	has(e, t) {
		return e instanceof IDBTransaction && (t === "done" || t === "store") || t in e;
	}
};
function Qe(e) {
	Ze = e(Ze);
}
function $e(e) {
	return e === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(t, ...n) {
		let r = e.call(nt(this), t, ...n);
		return Ke.set(r, t.sort ? t.sort() : [t]), tt(r);
	} : Ue().includes(e) ? function(...t) {
		return e.apply(nt(this), t), tt(We.get(this));
	} : function(...t) {
		return tt(e.apply(nt(this), t));
	};
}
function et(e) {
	return typeof e == "function" ? $e(e) : (e instanceof IDBTransaction && Xe(e), ze(e, He()) ? new Proxy(e, Ze) : e);
}
function tt(e) {
	if (e instanceof IDBRequest) return Ye(e);
	if (qe.has(e)) return qe.get(e);
	let t = et(e);
	return t !== e && (qe.set(e, t), Je.set(t, e)), t;
}
var nt = (e) => Je.get(e);
//#endregion
//#region node_modules/idb/build/index.js
function rt(e, t, { blocked: n, upgrade: r, blocking: i, terminated: a } = {}) {
	let o = indexedDB.open(e, t), s = tt(o);
	return r && o.addEventListener("upgradeneeded", (e) => {
		r(tt(o.result), e.oldVersion, e.newVersion, tt(o.transaction), e);
	}), n && o.addEventListener("blocked", (e) => n(e.oldVersion, e.newVersion, e)), s.then((e) => {
		a && e.addEventListener("close", () => a()), i && e.addEventListener("versionchange", (e) => i(e.oldVersion, e.newVersion, e));
	}).catch(() => {}), s;
}
var it = [
	"get",
	"getKey",
	"getAll",
	"getAllKeys",
	"count"
], at = [
	"put",
	"add",
	"delete",
	"clear"
], ot = /* @__PURE__ */ new Map();
function st(e, t) {
	if (!(e instanceof IDBDatabase && !(t in e) && typeof t == "string")) return;
	if (ot.get(t)) return ot.get(t);
	let n = t.replace(/FromIndex$/, ""), r = t !== n, i = at.includes(n);
	if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(i || it.includes(n))) return;
	let a = async function(e, ...t) {
		let a = this.transaction(e, i ? "readwrite" : "readonly"), o = a.store;
		return r && (o = o.index(t.shift())), (await Promise.all([o[n](...t), i && a.done]))[0];
	};
	return ot.set(t, a), a;
}
Qe((e) => ({
	...e,
	get: (t, n, r) => st(t, n) || e.get(t, n, r),
	has: (t, n) => !!st(t, n) || e.has(t, n)
}));
//#endregion
//#region node_modules/@firebase/app/dist/esm/index.esm.js
var ct = class {
	constructor(e) {
		this.container = e;
	}
	getPlatformInfoString() {
		return this.container.getProviders().map((e) => {
			if (lt(e)) {
				let t = e.getImmediate();
				return `${t.library}/${t.version}`;
			}
			return null;
		}).filter((e) => e).join(" ");
	}
};
function lt(e) {
	return e.getComponent()?.type === "VERSION";
}
var ut = "@firebase/app", dt = "0.16.2", ft = new Re("@firebase/app"), pt = "@firebase/app-compat", mt = "@firebase/analytics-compat", ht = "@firebase/analytics", gt = "@firebase/app-check-compat", _t = "@firebase/app-check", vt = "@firebase/auth", yt = "@firebase/auth-compat", bt = "@firebase/database", xt = "@firebase/data-connect", St = "@firebase/database-compat", Ct = "@firebase/functions", wt = "@firebase/functions-compat", Tt = "@firebase/installations", Et = "@firebase/installations-compat", Dt = "@firebase/messaging", Ot = "@firebase/messaging-compat", kt = "@firebase/performance", At = "@firebase/performance-compat", jt = "@firebase/remote-config", Mt = "@firebase/remote-config-compat", Nt = "@firebase/storage", Pt = "@firebase/storage-compat", Ft = "@firebase/firestore", It = "@firebase/ai", Lt = "@firebase/firestore-compat", Rt = "firebase", zt = "12.19.0", Bt = "[DEFAULT]", Vt = {
	[ut]: "fire-core",
	[pt]: "fire-core-compat",
	[ht]: "fire-analytics",
	[mt]: "fire-analytics-compat",
	[_t]: "fire-app-check",
	[gt]: "fire-app-check-compat",
	[vt]: "fire-auth",
	[yt]: "fire-auth-compat",
	[bt]: "fire-rtdb",
	[xt]: "fire-data-connect",
	[St]: "fire-rtdb-compat",
	[Ct]: "fire-fn",
	[wt]: "fire-fn-compat",
	[Tt]: "fire-iid",
	[Et]: "fire-iid-compat",
	[Dt]: "fire-fcm",
	[Ot]: "fire-fcm-compat",
	[kt]: "fire-perf",
	[At]: "fire-perf-compat",
	[jt]: "fire-rc",
	[Mt]: "fire-rc-compat",
	[Nt]: "fire-gcs",
	[Pt]: "fire-gcs-compat",
	[Ft]: "fire-fst",
	[Lt]: "fire-fst-compat",
	[It]: "fire-vertex",
	"fire-js": "fire-js",
	[Rt]: "fire-js-all"
}, Ht = /* @__PURE__ */ new Map(), Ut = /* @__PURE__ */ new Map(), Wt = /* @__PURE__ */ new Map();
function Gt(e, t) {
	try {
		e.container.addComponent(t);
	} catch (n) {
		ft.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`, n);
	}
}
function Kt(e) {
	let t = e.name;
	if (Wt.has(t)) return ft.debug(`There were multiple attempts to register component ${t}.`), !1;
	Wt.set(t, e);
	for (let t of Ht.values()) Gt(t, e);
	for (let t of Ut.values()) Gt(t, e);
	return !0;
}
function qt(e, t) {
	let n = e.container.getProvider("heartbeat").getImmediate({ optional: !0 });
	return n && n.triggerHeartbeat(), e.container.getProvider(t);
}
function Jt(e) {
	return e != null && e.settings !== void 0;
}
var b = new fe("app", "Firebase", {
	"no-app": "No Firebase App '{$appName}' has been created - call initializeApp() first",
	"bad-app-name": "Illegal App name: '{$appName}'",
	"duplicate-app": "Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.",
	"app-deleted": "Firebase App named '{$appName}' already deleted",
	"server-app-deleted": "Firebase Server App has been deleted",
	"no-options": "Need to provide options, when not being deployed to hosting via source.",
	"invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance.",
	"invalid-log-argument": "First argument to `onLog` must be null or a function.",
	"idb-open": "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
	"idb-get": "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
	"idb-set": "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
	"idb-delete": "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
	"finalization-registry-not-supported": "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
	"invalid-server-app-environment": "FirebaseServerApp is not for use in browser environments."
}), Yt = class {
	constructor(e, t, n) {
		this._isDeleted = !1, this._options = { ...e }, this._config = { ...t }, this._name = t.name, this._automaticDataCollectionEnabled = t.automaticDataCollectionEnabled, this._container = n, this.container.addComponent(new De("app", () => this, "PUBLIC"));
	}
	get automaticDataCollectionEnabled() {
		return this.checkDestroyed(), this._automaticDataCollectionEnabled;
	}
	set automaticDataCollectionEnabled(e) {
		this.checkDestroyed(), this._automaticDataCollectionEnabled = e;
	}
	get name() {
		return this.checkDestroyed(), this._name;
	}
	get options() {
		return this.checkDestroyed(), this._options;
	}
	get config() {
		return this.checkDestroyed(), this._config;
	}
	get container() {
		return this._container;
	}
	get isDeleted() {
		return this._isDeleted;
	}
	set isDeleted(e) {
		this._isDeleted = e;
	}
	checkDestroyed() {
		if (this.isDeleted) throw b.create("app-deleted", { appName: this._name });
	}
}, Xt = zt;
function Zt(e, t = {}) {
	let n = e;
	typeof t != "object" && (t = { name: t });
	let r = {
		name: Bt,
		automaticDataCollectionEnabled: !0,
		...t
	}, i = r.name;
	if (typeof i != "string" || !i) throw b.create("bad-app-name", { appName: String(i) });
	if (n ||= h(), !n) throw b.create("no-options");
	let a = Ht.get(i);
	if (a) {
		if (!he(n, a.options)) throw b.create("duplicate-app", {
			appName: i,
			mismatchedParam: "options",
			oldValue: JSON.stringify(a.options),
			newValue: JSON.stringify(n)
		});
		if (he(r, a.config)) return a;
		throw b.create("duplicate-app", {
			appName: i,
			mismatchedParam: "config",
			oldValue: JSON.stringify(a.config),
			newValue: JSON.stringify(r)
		});
	}
	let o = new Me(i);
	for (let e of Wt.values()) o.addComponent(e);
	let s = new Yt(n, r, o);
	return Ht.set(i, s), s;
}
function Qt(e = Bt) {
	let t = Ht.get(e);
	if (!t && e === "[DEFAULT]" && h()) return Zt();
	if (!t) throw b.create("no-app", { appName: e });
	return t;
}
function $t() {
	return Array.from(Ht.values());
}
function en(e, t, n) {
	let r = Vt[e] ?? e;
	n && (r += `-${n}`);
	let i = r.match(/\s|\//), a = t.match(/\s|\//);
	if (i || a) {
		let e = [`Unable to register library "${r}" with version "${t}":`];
		i && e.push(`library name "${r}" contains illegal characters (whitespace or "/")`), i && a && e.push("and"), a && e.push(`version name "${t}" contains illegal characters (whitespace or "/")`), ft.warn(e.join(" "));
		return;
	}
	Kt(new De(`${r}-version`, () => ({
		library: r,
		version: t
	}), "VERSION"));
}
var tn = "firebase-heartbeat-database", nn = 1, rn = "firebase-heartbeat-store", an = null;
function on() {
	return an ||= rt(tn, nn, { upgrade: (e, t) => {
		if (t === 0) try {
			e.createObjectStore(rn);
		} catch (e) {
			console.warn(e);
		}
	} }).catch((e) => {
		throw b.create("idb-open", { originalErrorMessage: e.message });
	}), an;
}
async function sn(e) {
	try {
		let t = (await on()).transaction(rn), n = await t.objectStore(rn).get(ln(e));
		return await t.done, n;
	} catch (e) {
		if (e instanceof de) ft.warn(e.message);
		else {
			let t = b.create("idb-get", { originalErrorMessage: e?.message });
			ft.warn(t.message);
		}
	}
}
async function cn(e, t) {
	try {
		let n = (await on()).transaction(rn, "readwrite");
		await n.objectStore(rn).put(t, ln(e)), await n.done;
	} catch (e) {
		if (e instanceof de) ft.warn(e.message);
		else {
			let t = b.create("idb-set", { originalErrorMessage: e?.message });
			ft.warn(t.message);
		}
	}
}
function ln(e) {
	return `${e.name}!${e.options.appId}`;
}
var un = 1024, dn = 30, fn = class {
	constructor(e) {
		this.container = e, this._heartbeatsCache = null;
		let t = this.container.getProvider("app").getImmediate();
		this._storage = new hn(t), this._heartbeatsCachePromise = this._storage.read().then((e) => (this._heartbeatsCache = e, e));
	}
	async triggerHeartbeat() {
		try {
			let e = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(), t = pn();
			if (this._heartbeatsCache?.heartbeats == null && (this._heartbeatsCache = await this._heartbeatsCachePromise, this._heartbeatsCache?.heartbeats == null) || this._heartbeatsCache.lastSentHeartbeatDate === t || this._heartbeatsCache.heartbeats.some((e) => e.date === t)) return;
			if (this._heartbeatsCache.heartbeats.push({
				date: t,
				agent: e
			}), this._heartbeatsCache.heartbeats.length > dn) {
				let e = _n(this._heartbeatsCache.heartbeats);
				this._heartbeatsCache.heartbeats.splice(e, 1);
			}
			return this._storage.overwrite(this._heartbeatsCache);
		} catch (e) {
			ft.warn(e);
		}
	}
	async getHeartbeatsHeader() {
		try {
			if (this._heartbeatsCache === null && await this._heartbeatsCachePromise, this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) return "";
			let e = pn(), { heartbeatsToSend: t, unsentEntries: n } = mn(this._heartbeatsCache.heartbeats), r = o(JSON.stringify({
				version: 2,
				heartbeats: t
			}));
			return this._heartbeatsCache.lastSentHeartbeatDate = e, n.length > 0 ? (this._heartbeatsCache.heartbeats = n, await this._storage.overwrite(this._heartbeatsCache)) : (this._heartbeatsCache.heartbeats = [], this._storage.overwrite(this._heartbeatsCache)), r;
		} catch (e) {
			return ft.warn(e), "";
		}
	}
};
function pn() {
	return (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
}
function mn(e, t = un) {
	let n = [], r = e.slice();
	for (let i of e) {
		let e = n.find((e) => e.agent === i.agent);
		if (!e) {
			if (n.push({
				agent: i.agent,
				dates: [i.date]
			}), gn(n) > t) {
				n.pop();
				break;
			}
		} else if (e.dates.push(i.date), gn(n) > t) {
			e.dates.pop();
			break;
		}
		r = r.slice(1);
	}
	return {
		heartbeatsToSend: n,
		unsentEntries: r
	};
}
var hn = class {
	constructor(e) {
		this.app = e, this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
	}
	async runIndexedDBEnvironmentCheck() {
		return ce() ? le().then(() => !0).catch(() => !1) : !1;
	}
	async read() {
		if (await this._canUseIndexedDBPromise) {
			let e = await sn(this.app);
			return e?.heartbeats ? e : { heartbeats: [] };
		}
		return { heartbeats: [] };
	}
	async overwrite(e) {
		if (await this._canUseIndexedDBPromise) {
			let t = await this.read();
			return cn(this.app, {
				lastSentHeartbeatDate: e.lastSentHeartbeatDate ?? t.lastSentHeartbeatDate,
				heartbeats: e.heartbeats
			});
		}
	}
	async add(e) {
		if (await this._canUseIndexedDBPromise) {
			let t = await this.read();
			return cn(this.app, {
				lastSentHeartbeatDate: e.lastSentHeartbeatDate ?? t.lastSentHeartbeatDate,
				heartbeats: [...t.heartbeats, ...e.heartbeats]
			});
		}
	}
};
function gn(e) {
	return o(JSON.stringify({
		version: 2,
		heartbeats: e
	})).length;
}
function _n(e) {
	if (e.length === 0) return -1;
	let t = 0, n = e[0].date;
	for (let r = 1; r < e.length; r++) e[r].date < n && (n = e[r].date, t = r);
	return t;
}
function vn(e) {
	Kt(new De("platform-logger", (e) => new ct(e), "PRIVATE")), Kt(new De("heartbeat", (e) => new fn(e), "PRIVATE")), en(ut, dt, e), en(ut, dt, "esm2020"), en("fire-js", "");
}
//#endregion
//#region node_modules/firebase/app/dist/esm/index.esm.js
vn(""), en("firebase", "12.19.0", "app");
//#endregion
//#region node_modules/@firebase/auth/dist/esm/index-4NFEPWkC.js
function yn() {
	return { "dependent-sdk-initialized-before-auth": "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK." };
}
var bn = yn, xn = new fe("auth", "Firebase", yn()), Sn = new Re("@firebase/auth");
function Cn(e, ...t) {
	Sn.logLevel <= y.WARN && Sn.warn(`Auth (${Xt}): ${e}`, ...t);
}
function wn(e, ...t) {
	Sn.logLevel <= y.ERROR && Sn.error(`Auth (${Xt}): ${e}`, ...t);
}
function x(e, ...t) {
	throw On(e, ...t);
}
function Tn(e, ...t) {
	return On(e, ...t);
}
function En(e, t, n) {
	return new fe("auth", "Firebase", {
		...bn(),
		[t]: n
	}).create(t, { appName: e.name });
}
function Dn(e) {
	return En(e, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
}
function On(e, ...t) {
	if (typeof e != "string") {
		let n = t[0], r = [...t.slice(1)];
		return r[0] && (r[0].appName = e.name), e._errorFactory.create(n, ...r);
	}
	return xn.create(e, ...t);
}
function S(e, t, ...n) {
	if (!e) throw On(t, ...n);
}
function kn(e) {
	let t = "INTERNAL ASSERTION FAILED: " + e;
	throw wn(t), Error(t);
}
function An(e, t) {
	e || kn(t);
}
function jn() {
	return typeof self < "u" && self.location?.href || "";
}
function Mn() {
	return Nn() === "http:" || Nn() === "https:";
}
function Nn() {
	return typeof self < "u" && self.location?.protocol || null;
}
function Pn() {
	return typeof navigator < "u" && navigator && "onLine" in navigator && typeof navigator.onLine == "boolean" && (Mn() || ie() || "connection" in navigator) ? navigator.onLine : !0;
}
function Fn() {
	if (typeof navigator > "u") return null;
	let e = navigator;
	return e.languages && e.languages[0] || e.language || null;
}
var In = class {
	constructor(e, t) {
		this.shortDelay = e, this.longDelay = t, An(t > e, "Short delay should be less than long delay!"), this.isMobile = te() || ae();
	}
	get() {
		return Pn() ? this.isMobile ? this.longDelay : this.shortDelay : Math.min(5e3, this.shortDelay);
	}
};
function Ln(e, t) {
	An(e.emulator, "Emulator should always be set here");
	let { url: n } = e.emulator;
	return t ? `${n}${t.startsWith("/") ? t.slice(1) : t}` : n;
}
var Rn = class {
	static initialize(e, t, n) {
		this.fetchImpl = e, t && (this.headersImpl = t), n && (this.responseImpl = n);
	}
	static fetch() {
		if (this.fetchImpl) return this.fetchImpl;
		if (typeof self < "u" && "fetch" in self) return self.fetch;
		if (typeof globalThis < "u" && globalThis.fetch) return globalThis.fetch;
		if (typeof fetch < "u") return fetch;
		kn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
	}
	static headers() {
		if (this.headersImpl) return this.headersImpl;
		if (typeof self < "u" && "Headers" in self) return self.Headers;
		if (typeof globalThis < "u" && globalThis.Headers) return globalThis.Headers;
		if (typeof Headers < "u") return Headers;
		kn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
	}
	static response() {
		if (this.responseImpl) return this.responseImpl;
		if (typeof self < "u" && "Response" in self) return self.Response;
		if (typeof globalThis < "u" && globalThis.Response) return globalThis.Response;
		if (typeof Response < "u") return Response;
		kn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
	}
}, zn = {
	CREDENTIAL_MISMATCH: "custom-token-mismatch",
	MISSING_CUSTOM_TOKEN: "internal-error",
	INVALID_IDENTIFIER: "invalid-email",
	MISSING_CONTINUE_URI: "internal-error",
	INVALID_PASSWORD: "wrong-password",
	MISSING_PASSWORD: "missing-password",
	INVALID_LOGIN_CREDENTIALS: "invalid-credential",
	EMAIL_EXISTS: "email-already-in-use",
	PASSWORD_LOGIN_DISABLED: "operation-not-allowed",
	INVALID_IDP_RESPONSE: "invalid-credential",
	INVALID_PENDING_TOKEN: "invalid-credential",
	FEDERATED_USER_ID_ALREADY_LINKED: "credential-already-in-use",
	MISSING_REQ_TYPE: "internal-error",
	EMAIL_NOT_FOUND: "user-not-found",
	RESET_PASSWORD_EXCEED_LIMIT: "too-many-requests",
	EXPIRED_OOB_CODE: "expired-action-code",
	INVALID_OOB_CODE: "invalid-action-code",
	MISSING_OOB_CODE: "internal-error",
	CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "requires-recent-login",
	INVALID_ID_TOKEN: "invalid-user-token",
	TOKEN_EXPIRED: "user-token-expired",
	USER_NOT_FOUND: "user-token-expired",
	TOO_MANY_ATTEMPTS_TRY_LATER: "too-many-requests",
	PASSWORD_DOES_NOT_MEET_REQUIREMENTS: "password-does-not-meet-requirements",
	INVALID_CODE: "invalid-verification-code",
	INVALID_SESSION_INFO: "invalid-verification-id",
	INVALID_TEMPORARY_PROOF: "invalid-credential",
	MISSING_SESSION_INFO: "missing-verification-id",
	SESSION_EXPIRED: "code-expired",
	MISSING_ANDROID_PACKAGE_NAME: "missing-android-pkg-name",
	UNAUTHORIZED_DOMAIN: "unauthorized-continue-uri",
	INVALID_OAUTH_CLIENT_ID: "invalid-oauth-client-id",
	ADMIN_ONLY_OPERATION: "admin-restricted-operation",
	INVALID_MFA_PENDING_CREDENTIAL: "invalid-multi-factor-session",
	MFA_ENROLLMENT_NOT_FOUND: "multi-factor-info-not-found",
	MISSING_MFA_ENROLLMENT_ID: "missing-multi-factor-info",
	MISSING_MFA_PENDING_CREDENTIAL: "missing-multi-factor-session",
	SECOND_FACTOR_EXISTS: "second-factor-already-in-use",
	SECOND_FACTOR_LIMIT_EXCEEDED: "maximum-second-factor-count-exceeded",
	BLOCKING_FUNCTION_ERROR_RESPONSE: "internal-error",
	RECAPTCHA_NOT_ENABLED: "recaptcha-not-enabled",
	MISSING_RECAPTCHA_TOKEN: "missing-recaptcha-token",
	INVALID_RECAPTCHA_TOKEN: "invalid-recaptcha-token",
	INVALID_RECAPTCHA_ACTION: "invalid-recaptcha-action",
	MISSING_CLIENT_TYPE: "missing-client-type",
	MISSING_RECAPTCHA_VERSION: "missing-recaptcha-version",
	INVALID_RECAPTCHA_VERSION: "invalid-recaptcha-version",
	INVALID_REQ_TYPE: "invalid-req-type"
}, Bn = [
	"/v1/accounts:signInWithCustomToken",
	"/v1/accounts:signInWithEmailLink",
	"/v1/accounts:signInWithIdp",
	"/v1/accounts:signInWithPassword",
	"/v1/accounts:signInWithPhoneNumber",
	"/v1/token"
], Vn = new In(3e4, 6e4);
function Hn(e, t) {
	return e.tenantId && !t.tenantId ? {
		...t,
		tenantId: e.tenantId
	} : t;
}
async function Un(e, t, n, r, i = {}) {
	return Wn(e, i, async () => {
		let i = {}, a = {};
		r && (t === "GET" ? a = r : i = { body: JSON.stringify(r) });
		let o = _e({
			...a,
			key: e.config.apiKey
		}).slice(1), s = await e._getAdditionalHeaders();
		s["Content-Type"] = "application/json", e.languageCode && (s["X-Firebase-Locale"] = e.languageCode);
		let c = {
			method: t,
			headers: s,
			...i
		};
		return re() || (c.referrerPolicy = "strict-origin-when-cross-origin"), e.emulatorConfig && Te(e.emulatorConfig.host) && (c.credentials = "include"), Rn.fetch()(await Kn(e, e.config.apiHost, n, o), c);
	});
}
async function Wn(e, t, n) {
	e._canInitEmulator = !1;
	let r = {
		...zn,
		...t
	};
	try {
		let t = new Jn(e), i = await Promise.race([n(), t.promise]);
		t.clearNetworkTimeout();
		let a = await i.json();
		if ("needConfirmation" in a) throw Yn(e, "account-exists-with-different-credential", a);
		if (i.ok && !("errorMessage" in a)) return a;
		{
			let [t, n] = (i.ok ? a.errorMessage : a.error.message).split(" : ");
			if (t === "FEDERATED_USER_ID_ALREADY_LINKED") throw Yn(e, "credential-already-in-use", a);
			if (t === "EMAIL_EXISTS") throw Yn(e, "email-already-in-use", a);
			if (t === "USER_DISABLED") throw Yn(e, "user-disabled", a);
			let o = r[t] || t.toLowerCase().replace(/[_\s]+/g, "-");
			if (n) throw En(e, o, n);
			x(e, o);
		}
	} catch (t) {
		if (t instanceof de) throw t;
		x(e, "network-request-failed", { message: String(t) });
	}
}
async function Gn(e, t, n, r, i = {}) {
	let a = await Un(e, t, n, r, i);
	return "mfaPendingCredential" in a && x(e, "multi-factor-auth-required", { _serverResponse: a }), a;
}
async function Kn(e, t, n, r) {
	let i = `${t}${n}?${r}`, a = e, o = a.config.emulator ? Ln(e.config, i) : `${e.config.apiScheme}://${i}`;
	return Bn.includes(n) && (await a._persistenceManagerAvailable, a._getPersistenceType() === "COOKIE") ? a._getPersistence()._getFinalTarget(o).toString() : o;
}
function qn(e) {
	switch (e) {
		case "ENFORCE": return "ENFORCE";
		case "AUDIT": return "AUDIT";
		case "OFF": return "OFF";
		default: return "ENFORCEMENT_STATE_UNSPECIFIED";
	}
}
var Jn = class {
	clearNetworkTimeout() {
		clearTimeout(this.timer);
	}
	constructor(e) {
		this.auth = e, this.timer = null, this.promise = new Promise((e, t) => {
			this.timer = setTimeout(() => t(Tn(this.auth, "network-request-failed")), Vn.get());
		});
	}
};
function Yn(e, t, n) {
	let r = { appName: e.name };
	n.email && (r.email = n.email), n.phoneNumber && (r.phoneNumber = n.phoneNumber);
	let i = Tn(e, t, r);
	return i.customData._tokenResponse = n, i;
}
function Xn(e) {
	return e !== void 0 && e.enterprise !== void 0;
}
var Zn = class {
	constructor(e) {
		if (this.siteKey = "", this.recaptchaEnforcementState = [], e.recaptchaKey === void 0) throw Error("recaptchaKey undefined");
		this.siteKey = e.recaptchaKey.split("/")[3], this.recaptchaEnforcementState = e.recaptchaEnforcementState;
	}
	getProviderEnforcementState(e) {
		if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) return null;
		for (let t of this.recaptchaEnforcementState) if (t.provider && t.provider === e) return qn(t.enforcementState);
		return null;
	}
	isProviderEnabled(e) {
		return this.getProviderEnforcementState(e) === "ENFORCE" || this.getProviderEnforcementState(e) === "AUDIT";
	}
	isAnyProviderEnabled() {
		return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER") || this.isProviderEnabled("PHONE_PROVIDER");
	}
};
async function Qn(e, t) {
	return Un(e, "GET", "/v2/recaptchaConfig", Hn(e, t));
}
async function $n(e, t) {
	return Un(e, "POST", "/v1/accounts:delete", t);
}
async function er(e, t) {
	return Un(e, "POST", "/v1/accounts:lookup", t);
}
function tr(e) {
	if (e) try {
		let t = new Date(Number(e));
		if (!isNaN(t.getTime())) return t.toUTCString();
	} catch {}
}
async function nr(e, t = !1) {
	let n = we(e), r = await n.getIdToken(t), i = ir(r);
	S(i && i.exp && i.auth_time && i.iat, n.auth, "internal-error");
	let a = typeof i.firebase == "object" ? i.firebase : void 0, o = a?.sign_in_provider;
	return {
		claims: i,
		token: r,
		authTime: tr(rr(i.auth_time)),
		issuedAtTime: tr(rr(i.iat)),
		expirationTime: tr(rr(i.exp)),
		signInProvider: o || null,
		signInSecondFactor: a?.sign_in_second_factor || null
	};
}
function rr(e) {
	return Number(e) * 1e3;
}
function ir(e) {
	let [t, n, r] = e.split(".");
	if (t === void 0 || n === void 0 || r === void 0) return wn("JWT malformed, contained fewer than 3 sections"), null;
	try {
		let e = s(n);
		return e ? JSON.parse(e) : (wn("Failed to decode base64 JWT payload"), null);
	} catch (e) {
		return wn("Caught error parsing JWT payload as JSON", e?.toString()), null;
	}
}
function ar(e) {
	let t = ir(e);
	return S(t, "internal-error"), S(t.exp !== void 0, "internal-error"), S(t.iat !== void 0, "internal-error"), Number(t.exp) - Number(t.iat);
}
async function or(e, t, n = !1) {
	if (n) return t;
	try {
		return await t;
	} catch (t) {
		throw t instanceof de && sr(t) && e.auth.currentUser === e && await e.auth.signOut(), t;
	}
}
function sr({ code: e }) {
	return e === "auth/user-disabled" || e === "auth/user-token-expired";
}
var cr = class {
	constructor(e) {
		this.user = e, this.isRunning = !1, this.timerId = null, this.errorBackoff = 3e4;
	}
	_start() {
		this.isRunning || (this.isRunning = !0, this.schedule());
	}
	_stop() {
		this.isRunning && (this.isRunning = !1, this.timerId !== null && clearTimeout(this.timerId));
	}
	getInterval(e) {
		if (e) {
			let e = this.errorBackoff;
			return this.errorBackoff = Math.min(this.errorBackoff * 2, 96e4), e;
		}
		{
			this.errorBackoff = 3e4;
			let e = (this.user.stsTokenManager.expirationTime ?? 0) - Date.now() - 3e5;
			return Math.max(0, e);
		}
	}
	schedule(e = !1) {
		if (!this.isRunning) return;
		let t = this.getInterval(e);
		this.timerId = setTimeout(async () => {
			await this.iteration();
		}, t);
	}
	async iteration() {
		try {
			await this.user.getIdToken(!0);
		} catch (e) {
			e?.code === "auth/network-request-failed" && this.schedule(!0);
			return;
		}
		this.schedule();
	}
}, lr = class {
	constructor(e, t) {
		this.createdAt = e, this.lastLoginAt = t, this._initializeTime();
	}
	_initializeTime() {
		this.lastSignInTime = tr(this.lastLoginAt), this.creationTime = tr(this.createdAt);
	}
	_copy(e) {
		this.createdAt = e.createdAt, this.lastLoginAt = e.lastLoginAt, this._initializeTime();
	}
	toJSON() {
		return {
			createdAt: this.createdAt,
			lastLoginAt: this.lastLoginAt
		};
	}
};
async function ur(e) {
	let t = e.auth, n = await or(e, er(t, { idToken: await e.getIdToken() }));
	S(n?.users.length, t, "internal-error");
	let r = n.users[0];
	e._notifyReloadListener(r);
	let i = r.providerUserInfo?.length ? pr(r.providerUserInfo) : [], a = fr(e.providerData, i), o = e.isAnonymous, s = !(e.email && r.passwordHash) && !a?.length, c = o ? s : !1, l = {
		uid: r.localId,
		displayName: r.displayName || null,
		photoURL: r.photoUrl || null,
		email: r.email || null,
		emailVerified: r.emailVerified || !1,
		phoneNumber: r.phoneNumber || null,
		tenantId: r.tenantId || null,
		providerData: a,
		metadata: new lr(r.createdAt, r.lastLoginAt),
		isAnonymous: c
	};
	Object.assign(e, l);
}
async function dr(e) {
	let t = we(e);
	await ur(t), await t.auth._persistUserIfCurrent(t), t.auth._notifyListenersIfCurrent(t);
}
function fr(e, t) {
	return [...e.filter((e) => !t.some((t) => t.providerId === e.providerId)), ...t];
}
function pr(e) {
	return e.map(({ providerId: e, ...t }) => ({
		providerId: e,
		uid: t.rawId || "",
		displayName: t.displayName || null,
		email: t.email || null,
		phoneNumber: t.phoneNumber || null,
		photoURL: t.photoUrl || null
	}));
}
async function mr(e, t) {
	let n = await Wn(e, {}, async () => {
		let n = _e({
			grant_type: "refresh_token",
			refresh_token: t
		}).slice(1), { tokenApiHost: r, apiKey: i } = e.config, a = await Kn(e, r, "/v1/token", `key=${i}`), o = await e._getAdditionalHeaders();
		o["Content-Type"] = "application/x-www-form-urlencoded";
		let s = {
			method: "POST",
			headers: o,
			body: n
		};
		return e.emulatorConfig && Te(e.emulatorConfig.host) && (s.credentials = "include"), Rn.fetch()(a, s);
	});
	return {
		accessToken: n.access_token,
		expiresIn: n.expires_in,
		refreshToken: n.refresh_token
	};
}
async function hr(e, t) {
	return Un(e, "POST", "/v2/accounts:revokeToken", Hn(e, t));
}
var gr = class e {
	constructor() {
		this.refreshToken = null, this.accessToken = null, this.expirationTime = null;
	}
	get isExpired() {
		return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
	}
	updateFromServerResponse(e) {
		S(e.idToken, "internal-error"), S(e.idToken !== void 0, "internal-error"), S(e.refreshToken !== void 0, "internal-error");
		let t = "expiresIn" in e && e.expiresIn !== void 0 ? Number(e.expiresIn) : ar(e.idToken);
		this.updateTokensAndExpiration(e.idToken, e.refreshToken, t);
	}
	updateFromIdToken(e) {
		S(e.length !== 0, "internal-error");
		let t = ar(e);
		this.updateTokensAndExpiration(e, null, t);
	}
	async getToken(e, t = !1) {
		return !t && this.accessToken && !this.isExpired ? this.accessToken : (S(this.refreshToken, e, "user-token-expired"), this.refreshToken ? (await this.refresh(e, this.refreshToken), this.accessToken) : null);
	}
	clearRefreshToken() {
		this.refreshToken = null;
	}
	async refresh(e, t) {
		let { accessToken: n, refreshToken: r, expiresIn: i } = await mr(e, t);
		this.updateTokensAndExpiration(n, r, Number(i));
	}
	updateTokensAndExpiration(e, t, n) {
		this.refreshToken = t || null, this.accessToken = e || null, this.expirationTime = Date.now() + n * 1e3;
	}
	static fromJSON(t, n) {
		let { refreshToken: r, accessToken: i, expirationTime: a } = n, o = new e();
		return r && (S(typeof r == "string", "internal-error", { appName: t }), o.refreshToken = r), i && (S(typeof i == "string", "internal-error", { appName: t }), o.accessToken = i), a && (S(typeof a == "number", "internal-error", { appName: t }), o.expirationTime = a), o;
	}
	toJSON() {
		return {
			refreshToken: this.refreshToken,
			accessToken: this.accessToken,
			expirationTime: this.expirationTime
		};
	}
	_assign(e) {
		this.accessToken = e.accessToken, this.refreshToken = e.refreshToken, this.expirationTime = e.expirationTime;
	}
	_clone() {
		return Object.assign(new e(), this.toJSON());
	}
	_performRefresh() {
		return kn("not implemented");
	}
};
function _r(e, t) {
	S(typeof e == "string" || e === void 0, "internal-error", { appName: t });
}
var vr = class e {
	constructor({ uid: e, auth: t, stsTokenManager: n, ...r }) {
		this.providerId = "firebase", this.proactiveRefresh = new cr(this), this.reloadUserInfo = null, this.reloadListener = null, this.uid = e, this.auth = t, this.stsTokenManager = n, this.accessToken = n.accessToken, this.displayName = r.displayName || null, this.email = r.email || null, this.emailVerified = r.emailVerified || !1, this.phoneNumber = r.phoneNumber || null, this.photoURL = r.photoURL || null, this.isAnonymous = r.isAnonymous || !1, this.tenantId = r.tenantId || null, this.providerData = r.providerData ? [...r.providerData] : [], this.metadata = new lr(r.createdAt || void 0, r.lastLoginAt || void 0);
	}
	async getIdToken(e) {
		let t = await or(this, this.stsTokenManager.getToken(this.auth, e));
		return S(t, this.auth, "internal-error"), this.accessToken !== t && (this.accessToken = t, await this.auth._persistUserIfCurrent(this), this.auth._notifyListenersIfCurrent(this)), t;
	}
	getIdTokenResult(e) {
		return nr(this, e);
	}
	reload() {
		return dr(this);
	}
	_assign(e) {
		this !== e && (S(this.uid === e.uid, this.auth, "internal-error"), this.displayName = e.displayName, this.photoURL = e.photoURL, this.email = e.email, this.emailVerified = e.emailVerified, this.phoneNumber = e.phoneNumber, this.isAnonymous = e.isAnonymous, this.tenantId = e.tenantId, this.providerData = e.providerData.map((e) => ({ ...e })), this.metadata._copy(e.metadata), this.stsTokenManager._assign(e.stsTokenManager));
	}
	_clone(t) {
		let n = new e({
			...this,
			auth: t,
			stsTokenManager: this.stsTokenManager._clone()
		});
		return n.metadata._copy(this.metadata), n;
	}
	_onReload(e) {
		S(!this.reloadListener, this.auth, "internal-error"), this.reloadListener = e, this.reloadUserInfo &&= (this._notifyReloadListener(this.reloadUserInfo), null);
	}
	_notifyReloadListener(e) {
		this.reloadListener ? this.reloadListener(e) : this.reloadUserInfo = e;
	}
	_startProactiveRefresh() {
		this.proactiveRefresh._start();
	}
	_stopProactiveRefresh() {
		this.proactiveRefresh._stop();
	}
	async _updateTokensIfNecessary(e, t = !1) {
		let n = !1;
		e.idToken && e.idToken !== this.stsTokenManager.accessToken && (this.stsTokenManager.updateFromServerResponse(e), n = !0), t && await ur(this), await this.auth._persistUserIfCurrent(this), n && this.auth._notifyListenersIfCurrent(this);
	}
	async delete() {
		if (Jt(this.auth.app)) return Promise.reject(Dn(this.auth));
		let e = await this.getIdToken();
		return await or(this, $n(this.auth, { idToken: e })), this.stsTokenManager.clearRefreshToken(), this.auth.signOut();
	}
	toJSON() {
		return {
			uid: this.uid,
			email: this.email || void 0,
			emailVerified: this.emailVerified,
			displayName: this.displayName || void 0,
			isAnonymous: this.isAnonymous,
			photoURL: this.photoURL || void 0,
			phoneNumber: this.phoneNumber || void 0,
			tenantId: this.tenantId || void 0,
			providerData: this.providerData.map((e) => ({ ...e })),
			stsTokenManager: this.stsTokenManager.toJSON(),
			_redirectEventId: this._redirectEventId,
			...this.metadata.toJSON(),
			apiKey: this.auth.config.apiKey,
			appName: this.auth.name
		};
	}
	get refreshToken() {
		return this.stsTokenManager.refreshToken || "";
	}
	static _fromJSON(t, n) {
		let r = n.displayName ?? void 0, i = n.email ?? void 0, a = n.phoneNumber ?? void 0, o = n.photoURL ?? void 0, s = n.tenantId ?? void 0, c = n._redirectEventId ?? void 0, l = n.createdAt ?? void 0, u = n.lastLoginAt ?? void 0, { uid: d, emailVerified: f, isAnonymous: p, providerData: m, stsTokenManager: h } = n;
		S(d && h, t, "internal-error");
		let g = gr.fromJSON(this.name, h);
		S(typeof d == "string", t, "internal-error"), _r(r, t.name), _r(i, t.name), S(typeof f == "boolean", t, "internal-error"), S(typeof p == "boolean", t, "internal-error"), _r(a, t.name), _r(o, t.name), _r(s, t.name), _r(c, t.name), _r(l, t.name), _r(u, t.name);
		let _ = new e({
			uid: d,
			auth: t,
			email: i,
			emailVerified: f,
			displayName: r,
			isAnonymous: p,
			photoURL: o,
			phoneNumber: a,
			tenantId: s,
			stsTokenManager: g,
			createdAt: l,
			lastLoginAt: u
		});
		return m && Array.isArray(m) && (_.providerData = m.map((e) => ({ ...e }))), c && (_._redirectEventId = c), _;
	}
	static async _fromIdTokenResponse(t, n, r = !1) {
		let i = new gr();
		i.updateFromServerResponse(n);
		let a = new e({
			uid: n.localId,
			auth: t,
			stsTokenManager: i,
			isAnonymous: r
		});
		return await ur(a), a;
	}
	static async _fromGetAccountInfoResponse(t, n, r) {
		let i = n.users[0];
		S(i.localId !== void 0, "internal-error");
		let a = i.providerUserInfo === void 0 ? [] : pr(i.providerUserInfo), o = !(i.email && i.passwordHash) && !a?.length, s = new gr();
		s.updateFromIdToken(r);
		let c = new e({
			uid: i.localId,
			auth: t,
			stsTokenManager: s,
			isAnonymous: o
		}), l = {
			uid: i.localId,
			displayName: i.displayName || null,
			photoURL: i.photoUrl || null,
			email: i.email || null,
			emailVerified: i.emailVerified || !1,
			phoneNumber: i.phoneNumber || null,
			tenantId: i.tenantId || null,
			providerData: a,
			metadata: new lr(i.createdAt, i.lastLoginAt),
			isAnonymous: !(i.email && i.passwordHash) && !a?.length
		};
		return Object.assign(c, l), c;
	}
}, yr = /* @__PURE__ */ new Map();
function br(e) {
	An(e instanceof Function, "Expected a class definition");
	let t = yr.get(e);
	return t ? (An(t instanceof e, "Instance stored in cache mismatched with class"), t) : (t = new e(), yr.set(e, t), t);
}
var xr = class {
	constructor() {
		this.type = "NONE", this.storage = {};
	}
	async _isAvailable() {
		return !0;
	}
	async _set(e, t) {
		this.storage[e] = t;
	}
	async _get(e) {
		let t = this.storage[e];
		return t === void 0 ? null : t;
	}
	async _remove(e) {
		delete this.storage[e];
	}
	_addListener(e, t) {}
	_removeListener(e, t) {}
};
xr.type = "NONE";
var Sr = xr;
function Cr(e, t, n) {
	return `firebase:${e}:${t}:${n}`;
}
var wr = class e {
	constructor(e, t, n) {
		this.persistence = e, this.auth = t, this.userKey = n;
		let { config: r, name: i } = this.auth;
		this.fullUserKey = Cr(this.userKey, r.apiKey, i), this.fullPersistenceKey = Cr("persistence", r.apiKey, i), this.boundEventHandler = t._onStorageEvent.bind(t);
		try {
			this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
		} catch {}
	}
	setCurrentUser(e) {
		return this.persistence._set(this.fullUserKey, e.toJSON());
	}
	async getCurrentUser() {
		let e = await this.persistence._get(this.fullUserKey);
		if (!e) return null;
		if (typeof e == "string") {
			let t = await er(this.auth, { idToken: e }).catch(() => void 0);
			return t ? vr._fromGetAccountInfoResponse(this.auth, t, e) : null;
		}
		return vr._fromJSON(this.auth, e);
	}
	removeCurrentUser() {
		return this.persistence._remove(this.fullUserKey);
	}
	savePersistenceForRedirect() {
		return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
	}
	async setPersistence(e) {
		if (this.persistence === e) return;
		let t = await this.getCurrentUser();
		if (await this.removeCurrentUser(), this.persistence = e, t) return this.setCurrentUser(t);
	}
	delete() {
		try {
			this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
		} catch {}
	}
	static async create(t, n, r = "authUser") {
		if (!n.length) return new e(br(Sr), t, r);
		let i = (await Promise.all(n.map(async (e) => {
			try {
				if (await e._isAvailable()) return e;
			} catch {
				return;
			}
		}))).filter((e) => e), a = i[0] || br(Sr), o = Cr(r, t.config.apiKey, t.name), s = null;
		for (let e of n) try {
			let n = await e._get(o);
			if (n) {
				let r;
				if (typeof n == "string") {
					let e = await er(t, { idToken: n }).catch(() => void 0);
					if (!e) break;
					r = await vr._fromGetAccountInfoResponse(t, e, n);
				} else r = vr._fromJSON(t, n);
				e !== a && (s = r), a = e;
				break;
			}
		} catch {}
		let c = i.filter((e) => e._shouldAllowMigration);
		return !a._shouldAllowMigration || !c.length ? new e(a, t, r) : (a = c[0], s && await a._set(o, s.toJSON()), await Promise.all(n.map(async (e) => {
			if (e !== a) try {
				await e._remove(o);
			} catch {}
		})), new e(a, t, r));
	}
};
function Tr(e) {
	let t = e.toLowerCase();
	if (t.includes("opera/") || t.includes("opr/") || t.includes("opios/")) return "Opera";
	if (kr(t)) return "IEMobile";
	if (t.includes("msie") || t.includes("trident/")) return "IE";
	if (t.includes("edge/")) return "Edge";
	if (Er(t)) return "Firefox";
	if (t.includes("silk/")) return "Silk";
	if (jr(t)) return "Blackberry";
	if (Mr(t)) return "Webos";
	if (Dr(t)) return "Safari";
	if ((t.includes("chrome/") || Or(t)) && !t.includes("edge/")) return "Chrome";
	if (Ar(t)) return "Android";
	{
		let t = e.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/);
		if (t?.length === 2) return t[1];
	}
	return "Other";
}
function Er(e = v()) {
	return /firefox\//i.test(e);
}
function Dr(e = v()) {
	let t = e.toLowerCase();
	return t.includes("safari/") && !t.includes("chrome/") && !t.includes("crios/") && !t.includes("android");
}
function Or(e = v()) {
	return /crios\//i.test(e);
}
function kr(e = v()) {
	return /iemobile/i.test(e);
}
function Ar(e = v()) {
	return /android/i.test(e);
}
function jr(e = v()) {
	return /blackberry/i.test(e);
}
function Mr(e = v()) {
	return /webos/i.test(e);
}
function Nr(e = v()) {
	return /iphone|ipad|ipod/i.test(e) || /macintosh/i.test(e) && /mobile/i.test(e);
}
function Pr(e = v()) {
	return Nr(e) && !!window.navigator?.standalone;
}
function Fr() {
	return oe() && document.documentMode === 10;
}
function Ir(e = v()) {
	return Nr(e) || Ar(e) || Mr(e) || jr(e) || /windows phone/i.test(e) || kr(e);
}
function Lr(e, t = []) {
	let n;
	switch (e) {
		case "Browser":
			n = Tr(v());
			break;
		case "Worker":
			n = `${Tr(v())}-${e}`;
			break;
		default: n = e;
	}
	let r = t.length ? t.join(",") : "FirebaseCore-web";
	return `${n}/JsCore/${Xt}/${r}`;
}
var Rr = class {
	constructor(e) {
		this.auth = e, this.queue = [];
	}
	pushCallback(e, t) {
		let n = (t) => new Promise((n, r) => {
			try {
				n(e(t));
			} catch (e) {
				r(e);
			}
		});
		n.onAbort = t, this.queue.push(n);
		let r = this.queue.length - 1;
		return () => {
			this.queue[r] = () => Promise.resolve();
		};
	}
	async runMiddleware(e) {
		if (this.auth.currentUser === e) return;
		let t = [];
		try {
			for (let n of this.queue) await n(e), n.onAbort && t.push(n.onAbort);
		} catch (e) {
			t.reverse();
			for (let e of t) try {
				e();
			} catch {}
			throw this.auth._errorFactory.create("login-blocked", { originalMessage: e?.message });
		}
	}
};
async function zr(e, t = {}) {
	return Un(e, "GET", "/v2/passwordPolicy", Hn(e, t));
}
var Br = 6, Vr = class {
	constructor(e) {
		let t = e.customStrengthOptions;
		this.customStrengthOptions = {}, this.customStrengthOptions.minPasswordLength = t.minPasswordLength ?? Br, t.maxPasswordLength && (this.customStrengthOptions.maxPasswordLength = t.maxPasswordLength), t.containsLowercaseCharacter !== void 0 && (this.customStrengthOptions.containsLowercaseLetter = t.containsLowercaseCharacter), t.containsUppercaseCharacter !== void 0 && (this.customStrengthOptions.containsUppercaseLetter = t.containsUppercaseCharacter), t.containsNumericCharacter !== void 0 && (this.customStrengthOptions.containsNumericCharacter = t.containsNumericCharacter), t.containsNonAlphanumericCharacter !== void 0 && (this.customStrengthOptions.containsNonAlphanumericCharacter = t.containsNonAlphanumericCharacter), this.enforcementState = e.enforcementState, this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED" && (this.enforcementState = "OFF"), this.allowedNonAlphanumericCharacters = e.allowedNonAlphanumericCharacters?.join("") ?? "", this.forceUpgradeOnSignin = e.forceUpgradeOnSignin ?? !1, this.schemaVersion = e.schemaVersion;
	}
	validatePassword(e) {
		let t = {
			isValid: !0,
			passwordPolicy: this
		};
		return this.validatePasswordLengthOptions(e, t), this.validatePasswordCharacterOptions(e, t), t.isValid &&= t.meetsMinPasswordLength ?? !0, t.isValid &&= t.meetsMaxPasswordLength ?? !0, t.isValid &&= t.containsLowercaseLetter ?? !0, t.isValid &&= t.containsUppercaseLetter ?? !0, t.isValid &&= t.containsNumericCharacter ?? !0, t.isValid &&= t.containsNonAlphanumericCharacter ?? !0, t;
	}
	validatePasswordLengthOptions(e, t) {
		let n = this.customStrengthOptions.minPasswordLength, r = this.customStrengthOptions.maxPasswordLength;
		n && (t.meetsMinPasswordLength = e.length >= n), r && (t.meetsMaxPasswordLength = e.length <= r);
	}
	validatePasswordCharacterOptions(e, t) {
		this.updatePasswordCharacterOptionsStatuses(t, !1, !1, !1, !1);
		let n;
		for (let r = 0; r < e.length; r++) n = e.charAt(r), this.updatePasswordCharacterOptionsStatuses(t, n >= "a" && n <= "z", n >= "A" && n <= "Z", n >= "0" && n <= "9", this.allowedNonAlphanumericCharacters.includes(n));
	}
	updatePasswordCharacterOptionsStatuses(e, t, n, r, i) {
		this.customStrengthOptions.containsLowercaseLetter && (e.containsLowercaseLetter ||= t), this.customStrengthOptions.containsUppercaseLetter && (e.containsUppercaseLetter ||= n), this.customStrengthOptions.containsNumericCharacter && (e.containsNumericCharacter ||= r), this.customStrengthOptions.containsNonAlphanumericCharacter && (e.containsNonAlphanumericCharacter ||= i);
	}
}, Hr = class {
	constructor(e, t, n, r) {
		this.app = e, this.heartbeatServiceProvider = t, this.appCheckServiceProvider = n, this.config = r, this.currentUser = null, this.emulatorConfig = null, this.operations = Promise.resolve(), this.authStateSubscription = new Wr(this), this.idTokenSubscription = new Wr(this), this.beforeStateQueue = new Rr(this), this.redirectUser = null, this.isProactiveRefreshEnabled = !1, this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1, this._canInitEmulator = !0, this._isInitialized = !1, this._deleted = !1, this._initializationPromise = null, this._popupRedirectResolver = null, this._errorFactory = xn, this._agentRecaptchaConfig = null, this._tenantRecaptchaConfigs = {}, this._projectPasswordPolicy = null, this._tenantPasswordPolicies = {}, this._resolvePersistenceManagerAvailable = void 0, this.lastNotifiedUid = void 0, this.languageCode = null, this.tenantId = null, this.settings = { appVerificationDisabledForTesting: !1 }, this.frameworks = [], this.name = e.name, this.clientVersion = r.sdkClientVersion, this._persistenceManagerAvailable = new Promise((e) => this._resolvePersistenceManagerAvailable = e);
	}
	_initializeWithPersistence(e, t) {
		return t && (this._popupRedirectResolver = br(t)), this._initializationPromise = this.queue(async () => {
			if (!this._deleted) {
				try {
					this.persistenceManager = await wr.create(this, e);
				} catch (e) {
					Cn(`Failed to initialize persistence: ${e}`), this.persistenceManager = await wr.create(this, []);
				} finally {
					this._resolvePersistenceManagerAvailable?.();
				}
				if (!this._deleted) {
					if (this._popupRedirectResolver?._shouldInitProactively) try {
						await this._popupRedirectResolver._initialize(this);
					} catch {}
					try {
						await this.initializeCurrentUser(t);
					} catch (e) {
						Cn(`Failed to initialize current user: ${e}`), await this.directlySetCurrentUser(null).catch(() => {});
					}
					this.lastNotifiedUid = this.currentUser?.uid || null, !this._deleted && (this._isInitialized = !0);
				}
			}
		}), this._initializationPromise;
	}
	async _onStorageEvent() {
		if (this._deleted) return;
		let e = await this.assertedPersistence.getCurrentUser();
		if (!(!this.currentUser && !e)) {
			if (this.currentUser && e && this.currentUser.uid === e.uid) {
				this._currentUser._assign(e), await this.currentUser.getIdToken();
				return;
			}
			await this._updateCurrentUser(e, !0);
		}
	}
	async initializeCurrentUserFromIdToken(e) {
		try {
			let t = await er(this, { idToken: e }), n = await vr._fromGetAccountInfoResponse(this, t, e);
			await this.directlySetCurrentUser(n);
		} catch (e) {
			console.warn("FirebaseServerApp could not login user with provided authIdToken: ", e), await this.directlySetCurrentUser(null);
		}
	}
	async initializeCurrentUser(e) {
		if (Jt(this.app)) {
			let e = this.app.settings.authIdToken;
			return e ? new Promise((t) => {
				setTimeout(() => this.initializeCurrentUserFromIdToken(e).then(t, t));
			}) : this.directlySetCurrentUser(null);
		}
		let t = await this.assertedPersistence.getCurrentUser(), n = t, r = !1;
		if (e && this.config.authDomain) {
			await this.getOrInitRedirectPersistenceManager();
			let t = this.redirectUser?._redirectEventId, i = n?._redirectEventId, a = await this.tryRedirectSignIn(e);
			(!t || t === i) && a?.user && (n = a.user, r = !0);
		}
		if (!n) return this.directlySetCurrentUser(null);
		if (!n._redirectEventId) {
			if (r) try {
				await this.beforeStateQueue.runMiddleware(n);
			} catch (e) {
				n = t, this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
			}
			return n ? this.reloadAndSetCurrentUserOrClear(n) : this.directlySetCurrentUser(null);
		}
		return S(this._popupRedirectResolver, this, "argument-error"), await this.getOrInitRedirectPersistenceManager(), this.redirectUser && this.redirectUser._redirectEventId === n._redirectEventId ? this.directlySetCurrentUser(n) : this.reloadAndSetCurrentUserOrClear(n);
	}
	async tryRedirectSignIn(e) {
		let t = null;
		try {
			t = await this._popupRedirectResolver._completeRedirectFn(this, e, !0);
		} catch {
			await this._setRedirectUser(null);
		}
		return t;
	}
	async reloadAndSetCurrentUserOrClear(e) {
		try {
			await ur(e);
		} catch (e) {
			if (e?.code !== "auth/network-request-failed") return this.directlySetCurrentUser(null);
		}
		return this.directlySetCurrentUser(e);
	}
	useDeviceLanguage() {
		this.languageCode = Fn();
	}
	async _delete() {
		this._deleted = !0;
	}
	async updateCurrentUser(e) {
		if (Jt(this.app)) return Promise.reject(Dn(this));
		let t = e ? we(e) : null;
		return t && S(t.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token"), this._updateCurrentUser(t && t._clone(this));
	}
	async _updateCurrentUser(e, t = !1) {
		if (!this._deleted) return e && S(this.tenantId === e.tenantId, this, "tenant-id-mismatch"), t || await this.beforeStateQueue.runMiddleware(e), this.queue(async () => {
			await this.directlySetCurrentUser(e), this.notifyAuthListeners();
		});
	}
	async signOut() {
		return Jt(this.app) ? Promise.reject(Dn(this)) : (await this.beforeStateQueue.runMiddleware(null), (this.redirectPersistenceManager || this._popupRedirectResolver) && await this._setRedirectUser(null), this._updateCurrentUser(null, !0));
	}
	setPersistence(e) {
		return Jt(this.app) ? Promise.reject(Dn(this)) : this.queue(async () => {
			await this.assertedPersistence.setPersistence(br(e));
		});
	}
	_getRecaptchaConfig() {
		return this.tenantId == null ? this._agentRecaptchaConfig : this._tenantRecaptchaConfigs[this.tenantId];
	}
	async validatePassword(e) {
		this._getPasswordPolicyInternal() || await this._updatePasswordPolicy();
		let t = this._getPasswordPolicyInternal();
		return t.schemaVersion === this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION ? t.validatePassword(e) : Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
	}
	_getPasswordPolicyInternal() {
		return this.tenantId === null ? this._projectPasswordPolicy : this._tenantPasswordPolicies[this.tenantId];
	}
	async _updatePasswordPolicy() {
		let e = new Vr(await zr(this));
		this.tenantId === null ? this._projectPasswordPolicy = e : this._tenantPasswordPolicies[this.tenantId] = e;
	}
	_getPersistenceType() {
		return this.assertedPersistence.persistence.type;
	}
	_getPersistence() {
		return this.assertedPersistence.persistence;
	}
	_updateErrorMap(e) {
		this._errorFactory = new fe("auth", "Firebase", e());
	}
	onAuthStateChanged(e, t, n) {
		return this.registerStateListener(this.authStateSubscription, e, t, n);
	}
	beforeAuthStateChanged(e, t) {
		return this.beforeStateQueue.pushCallback(e, t);
	}
	onIdTokenChanged(e, t, n) {
		return this.registerStateListener(this.idTokenSubscription, e, t, n);
	}
	authStateReady() {
		return new Promise((e, t) => {
			if (this.currentUser) e();
			else {
				let n = this.onAuthStateChanged(() => {
					n(), e();
				}, t);
			}
		});
	}
	async revokeAccessToken(e) {
		if (this.currentUser) {
			let t = {
				providerId: "apple.com",
				tokenType: "ACCESS_TOKEN",
				token: e,
				idToken: await this.currentUser.getIdToken()
			};
			this.tenantId != null && (t.tenantId = this.tenantId), await hr(this, t);
		}
	}
	toJSON() {
		return {
			apiKey: this.config.apiKey,
			authDomain: this.config.authDomain,
			appName: this.name,
			currentUser: this._currentUser?.toJSON()
		};
	}
	async _setRedirectUser(e, t) {
		let n = await this.getOrInitRedirectPersistenceManager(t);
		return e === null ? n.removeCurrentUser() : n.setCurrentUser(e);
	}
	async getOrInitRedirectPersistenceManager(e) {
		if (!this.redirectPersistenceManager) {
			let t = e && br(e) || this._popupRedirectResolver;
			S(t, this, "argument-error"), this.redirectPersistenceManager = await wr.create(this, [br(t._redirectPersistence)], "redirectUser"), this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
		}
		return this.redirectPersistenceManager;
	}
	async _redirectUserForId(e) {
		return this._isInitialized && await this.queue(async () => {}), this._currentUser?._redirectEventId === e ? this._currentUser : this.redirectUser?._redirectEventId === e ? this.redirectUser : null;
	}
	async _persistUserIfCurrent(e) {
		if (e === this.currentUser) return this.queue(async () => this.directlySetCurrentUser(e));
	}
	_notifyListenersIfCurrent(e) {
		e === this.currentUser && this.notifyAuthListeners();
	}
	_key() {
		return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
	}
	_startProactiveRefresh() {
		this.isProactiveRefreshEnabled = !0, this.currentUser && this._currentUser._startProactiveRefresh();
	}
	_stopProactiveRefresh() {
		this.isProactiveRefreshEnabled = !1, this.currentUser && this._currentUser._stopProactiveRefresh();
	}
	get _currentUser() {
		return this.currentUser;
	}
	notifyAuthListeners() {
		if (!this._isInitialized) return;
		this.idTokenSubscription.next(this.currentUser);
		let e = this.currentUser?.uid ?? null;
		this.lastNotifiedUid !== e && (this.lastNotifiedUid = e, this.authStateSubscription.next(this.currentUser));
	}
	registerStateListener(e, t, n, r) {
		if (this._deleted) return () => {};
		let i = typeof t == "function" ? t : t.next.bind(t), a = !1, o = this._isInitialized ? Promise.resolve() : this._initializationPromise;
		if (S(o, this, "internal-error"), o.then(() => {
			a || i(this.currentUser);
		}).catch((e) => {
			if (!a) {
				if (typeof t != "function" && t.error) t.error(e);
				else if (n) n(e);
				else throw e;
			}
		}), typeof t == "function") {
			let i = e.addObserver(t, n, r);
			return () => {
				a = !0, i();
			};
		}
		{
			let n = e.addObserver(t);
			return () => {
				a = !0, n();
			};
		}
	}
	async directlySetCurrentUser(e) {
		if (this.currentUser && this.currentUser !== e && this._currentUser._stopProactiveRefresh(), e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(), this.currentUser = e, this.persistenceManager) try {
			e ? await this.persistenceManager.setCurrentUser(e) : await this.persistenceManager.removeCurrentUser();
		} catch (e) {
			let t = e?.message || String(e), n = En(this, "internal-error", `An internal AuthError has occurred: ${t}`);
			throw n.customData = { originalError: e }, n;
		}
	}
	queue(e) {
		return this.operations = this.operations.then(e, e), this.operations;
	}
	get assertedPersistence() {
		return S(this.persistenceManager, this, "internal-error"), this.persistenceManager;
	}
	_logFramework(e) {
		!e || this.frameworks.includes(e) || (this.frameworks.push(e), this.frameworks.sort(), this.clientVersion = Lr(this.config.clientPlatform, this._getFrameworks()));
	}
	_getFrameworks() {
		return this.frameworks;
	}
	async _getAdditionalHeaders() {
		let e = { "X-Client-Version": this.clientVersion };
		this.app.options.appId && (e["X-Firebase-gmpid"] = this.app.options.appId);
		let t = await this.heartbeatServiceProvider.getImmediate({ optional: !0 })?.getHeartbeatsHeader();
		t && (e["X-Firebase-Client"] = t);
		let n = await this._getAppCheckToken();
		return n && (e["X-Firebase-AppCheck"] = n), e;
	}
	async _getAppCheckToken() {
		if (Jt(this.app) && this.app.settings.appCheckToken) return this.app.settings.appCheckToken;
		let e = await this.appCheckServiceProvider.getImmediate({ optional: !0 })?.getToken();
		return e?.error && Cn(`Error while retrieving App Check token: ${e.error}`), e?.token;
	}
};
function Ur(e) {
	return we(e);
}
var Wr = class {
	constructor(e) {
		this.auth = e, this.observer = null, this.addObserver = be((e) => this.observer = e);
	}
	get next() {
		return S(this.observer, this.auth, "internal-error"), this.observer.next.bind(this.observer);
	}
}, Gr = {
	async loadJS() {
		throw Error("Unable to load external scripts");
	},
	recaptchaV2Script: "",
	recaptchaEnterpriseScript: "",
	gapiScript: ""
};
function Kr(e) {
	Gr = e;
}
function qr(e) {
	return Gr.loadJS(e);
}
function Jr() {
	return Gr.recaptchaEnterpriseScript;
}
function Yr() {
	return Gr.gapiScript;
}
function Xr(e) {
	return `__${e}${Math.floor(Math.random() * 1e6)}`;
}
var Zr = class {
	constructor() {
		this.enterprise = new Qr();
	}
	ready(e) {
		e();
	}
	execute(e, t) {
		return Promise.resolve("token");
	}
	render(e, t) {
		return "";
	}
}, Qr = class {
	ready(e) {
		e();
	}
	execute(e, t) {
		return Promise.resolve("token");
	}
	render(e, t) {
		return "";
	}
}, $r = "recaptcha-enterprise", ei = "NO_RECAPTCHA", ti = "onFirebaseAuthREInstanceReady", ni = class e {
	constructor(e) {
		this.type = $r, this.auth = Ur(e);
	}
	async verify(t = "verify", n = !1) {
		async function r(e) {
			if (!n) {
				if (e.tenantId == null && e._agentRecaptchaConfig != null) return e._agentRecaptchaConfig.siteKey;
				if (e.tenantId != null && e._tenantRecaptchaConfigs[e.tenantId] !== void 0) return e._tenantRecaptchaConfigs[e.tenantId].siteKey;
			}
			return new Promise(async (t, n) => {
				Qn(e, {
					clientType: "CLIENT_TYPE_WEB",
					version: "RECAPTCHA_ENTERPRISE"
				}).then((r) => {
					if (r.recaptchaKey === void 0) n(/* @__PURE__ */ Error("recaptcha Enterprise site key undefined"));
					else {
						let n = new Zn(r);
						return e.tenantId == null ? e._agentRecaptchaConfig = n : e._tenantRecaptchaConfigs[e.tenantId] = n, t(n.siteKey);
					}
				}).catch((e) => {
					n(e);
				});
			});
		}
		function i(e, n, r) {
			let i = window.grecaptcha;
			Xn(i) ? i.enterprise.ready(() => {
				i.enterprise.execute(e, { action: t }).then((e) => {
					n(e);
				}).catch(() => {
					n(ei);
				});
			}) : r(Error("No reCAPTCHA enterprise script loaded."));
		}
		return this.auth.settings.appVerificationDisabledForTesting ? new Zr().execute("siteKey", { action: "verify" }) : new Promise((t, a) => {
			r(this.auth).then(async (r) => {
				if (!n && Xn(window.grecaptcha) && e.scriptInjectionDeferred) await e.scriptInjectionDeferred.promise, i(r, t, a);
				else {
					if (typeof window > "u") {
						a(/* @__PURE__ */ Error("RecaptchaVerifier is only supported in browser"));
						return;
					}
					let n = Jr();
					n.length !== 0 && (n += r + `&onload=${ti}`), e.scriptInjectionDeferred = new _(), window[ti] = () => {
						e.scriptInjectionDeferred?.resolve();
					}, qr(n).then(() => e.scriptInjectionDeferred?.promise).then(() => {
						i(r, t, a);
					}).catch((e) => {
						a(e);
					});
				}
			}).catch((e) => {
				a(e);
			});
		});
	}
};
ni.scriptInjectionDeferred = null;
async function ri(e, t, n, r = !1, i = !1) {
	let a = new ni(e), o;
	if (i) o = ei;
	else try {
		o = await a.verify(n);
	} catch {
		o = await a.verify(n, !0);
	}
	let s = { ...t };
	if (n === "mfaSmsEnrollment" || n === "mfaSmsSignIn") {
		if ("phoneEnrollmentInfo" in s) {
			let e = s.phoneEnrollmentInfo.phoneNumber, t = s.phoneEnrollmentInfo.recaptchaToken;
			Object.assign(s, { phoneEnrollmentInfo: {
				phoneNumber: e,
				recaptchaToken: t,
				captchaResponse: o,
				clientType: "CLIENT_TYPE_WEB",
				recaptchaVersion: "RECAPTCHA_ENTERPRISE"
			} });
		} else if ("phoneSignInInfo" in s) {
			let e = s.phoneSignInInfo.recaptchaToken;
			Object.assign(s, { phoneSignInInfo: {
				recaptchaToken: e,
				captchaResponse: o,
				clientType: "CLIENT_TYPE_WEB",
				recaptchaVersion: "RECAPTCHA_ENTERPRISE"
			} });
		}
		return s;
	}
	return r ? Object.assign(s, { captchaResp: o }) : Object.assign(s, { captchaResponse: o }), Object.assign(s, { clientType: "CLIENT_TYPE_WEB" }), Object.assign(s, { recaptchaVersion: "RECAPTCHA_ENTERPRISE" }), s;
}
async function ii(e, t, n, r, i) {
	return i === "EMAIL_PASSWORD_PROVIDER" ? e._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER") ? r(e, await ri(e, t, n, n === "getOobCode")) : r(e, t).catch(async (i) => i.code === "auth/missing-recaptcha-token" ? (console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`), r(e, await ri(e, t, n, n === "getOobCode"))) : Promise.reject(i)) : i === "PHONE_PROVIDER" ? e._getRecaptchaConfig()?.isProviderEnabled("PHONE_PROVIDER") ? r(e, await ri(e, t, n)).catch(async (i) => e._getRecaptchaConfig()?.getProviderEnforcementState("PHONE_PROVIDER") === "AUDIT" && (i.code === "auth/missing-recaptcha-token" || i.code === "auth/invalid-app-credential") ? (console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${n} flow.`), r(e, await ri(e, t, n, !1, !0))) : Promise.reject(i)) : r(e, await ri(e, t, n, !1, !0)) : Promise.reject(i + " provider is not supported.");
}
function ai(e, t) {
	let n = qt(e, "auth");
	if (n.isInitialized()) {
		let e = n.getImmediate();
		if (he(n.getOptions(), t ?? {})) return e;
		x(e, "already-initialized");
	}
	return n.initialize({ options: t });
}
function oi(e, t) {
	let n = t?.persistence || [], r = (Array.isArray(n) ? n : [n]).map(br);
	t?.errorMap && e._updateErrorMap(t.errorMap), e._initializeWithPersistence(r, t?.popupRedirectResolver);
}
function si(e, t, n) {
	let r = Ur(e);
	S(/^https?:\/\//.test(t), r, "invalid-emulator-scheme");
	let i = !!n?.disableWarnings, a = ci(t), { host: o, port: s } = li(t), c = s === null ? "" : `:${s}`, l = { url: `${a}//${o}${c}/` }, u = Object.freeze({
		host: o,
		port: s,
		protocol: a.replace(":", ""),
		options: Object.freeze({ disableWarnings: i })
	});
	if (!r._canInitEmulator) {
		S(r.config.emulator && r.emulatorConfig, r, "emulator-config-failed"), S(he(l, r.config.emulator) && he(u, r.emulatorConfig), r, "emulator-config-failed");
		return;
	}
	r.config.emulator = l, r.emulatorConfig = u, r.settings.appVerificationDisabledForTesting = !0, Te(o) ? Ee(`${a}//${o}${c}`) : i || di();
}
function ci(e) {
	let t = e.indexOf(":");
	return t < 0 ? "" : e.substr(0, t + 1);
}
function li(e) {
	let t = ci(e), n = /(\/\/)?([^?#/]+)/.exec(e.substr(t.length));
	if (!n) return {
		host: "",
		port: null
	};
	let r = n[2].split("@").pop() || "", i = /^(\[[^\]]+\])(:|$)/.exec(r);
	if (i) {
		let e = i[1];
		return {
			host: e,
			port: ui(r.substr(e.length + 1))
		};
	}
	{
		let [e, t] = r.split(":");
		return {
			host: e,
			port: ui(t)
		};
	}
}
function ui(e) {
	if (!e) return null;
	let t = Number(e);
	return isNaN(t) ? null : t;
}
function di() {
	function e() {
		let e = document.createElement("p"), t = e.style;
		e.innerText = "Running in emulator mode. Do not use with production credentials.", t.position = "fixed", t.width = "100%", t.backgroundColor = "#ffffff", t.border = ".1em solid #000000", t.color = "#b50000", t.bottom = "0px", t.left = "0px", t.margin = "0px", t.zIndex = "10000", t.textAlign = "center", e.classList.add("firebase-emulator-warning"), document.body.appendChild(e);
	}
	typeof console < "u" && typeof console.info == "function" && console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."), typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? window.addEventListener("DOMContentLoaded", e) : e());
}
var fi = class {
	constructor(e, t) {
		this.providerId = e, this.signInMethod = t;
	}
	toJSON() {
		return kn("not implemented");
	}
	_getIdTokenResponse(e) {
		return kn("not implemented");
	}
	_linkToIdToken(e, t) {
		return kn("not implemented");
	}
	_getReauthenticationResolver(e) {
		return kn("not implemented");
	}
};
async function pi(e, t) {
	return Un(e, "POST", "/v1/accounts:signUp", t);
}
async function mi(e, t) {
	return Gn(e, "POST", "/v1/accounts:signInWithPassword", Hn(e, t));
}
async function hi(e, t) {
	return Gn(e, "POST", "/v1/accounts:signInWithEmailLink", Hn(e, t));
}
async function gi(e, t) {
	return Gn(e, "POST", "/v1/accounts:signInWithEmailLink", Hn(e, t));
}
var _i = class e extends fi {
	constructor(e, t, n, r = null) {
		super("password", n), this._email = e, this._password = t, this._tenantId = r;
	}
	static _fromEmailAndPassword(t, n) {
		return new e(t, n, "password");
	}
	static _fromEmailAndCode(t, n, r = null) {
		return new e(t, n, "emailLink", r);
	}
	toJSON() {
		return {
			email: this._email,
			password: this._password,
			signInMethod: this.signInMethod,
			tenantId: this._tenantId
		};
	}
	static fromJSON(e) {
		let t = typeof e == "string" ? JSON.parse(e) : e;
		if (t?.email && t?.password) {
			if (t.signInMethod === "password") return this._fromEmailAndPassword(t.email, t.password);
			if (t.signInMethod === "emailLink") return this._fromEmailAndCode(t.email, t.password, t.tenantId);
		}
		return null;
	}
	async _getIdTokenResponse(e) {
		switch (this.signInMethod) {
			case "password": return ii(e, {
				returnSecureToken: !0,
				email: this._email,
				password: this._password,
				clientType: "CLIENT_TYPE_WEB"
			}, "signInWithPassword", mi, "EMAIL_PASSWORD_PROVIDER");
			case "emailLink": return hi(e, {
				email: this._email,
				oobCode: this._password
			});
			default: x(e, "internal-error");
		}
	}
	async _linkToIdToken(e, t) {
		switch (this.signInMethod) {
			case "password": return ii(e, {
				idToken: t,
				returnSecureToken: !0,
				email: this._email,
				password: this._password,
				clientType: "CLIENT_TYPE_WEB"
			}, "signUpPassword", pi, "EMAIL_PASSWORD_PROVIDER");
			case "emailLink": return gi(e, {
				idToken: t,
				email: this._email,
				oobCode: this._password
			});
			default: x(e, "internal-error");
		}
	}
	_getReauthenticationResolver(e) {
		return this._getIdTokenResponse(e);
	}
};
async function vi(e, t) {
	return Gn(e, "POST", "/v1/accounts:signInWithIdp", Hn(e, t));
}
var yi = "http://localhost", bi = class e extends fi {
	constructor() {
		super(...arguments), this.pendingToken = null;
	}
	static _fromParams(t) {
		let n = new e(t.providerId, t.signInMethod);
		return t.idToken || t.accessToken ? (t.idToken && (n.idToken = t.idToken), t.accessToken && (n.accessToken = t.accessToken), t.nonce && !t.pendingToken && (n.nonce = t.nonce), t.pendingToken && (n.pendingToken = t.pendingToken)) : t.oauthToken && t.oauthTokenSecret ? (n.accessToken = t.oauthToken, n.secret = t.oauthTokenSecret) : x("argument-error"), n;
	}
	toJSON() {
		return {
			idToken: this.idToken,
			accessToken: this.accessToken,
			secret: this.secret,
			nonce: this.nonce,
			pendingToken: this.pendingToken,
			providerId: this.providerId,
			signInMethod: this.signInMethod
		};
	}
	static fromJSON(t) {
		let { providerId: n, signInMethod: r, ...i } = typeof t == "string" ? JSON.parse(t) : t;
		if (!n || !r) return null;
		let a = new e(n, r);
		return a.idToken = i.idToken || void 0, a.accessToken = i.accessToken || void 0, a.secret = i.secret, a.nonce = i.nonce, a.pendingToken = i.pendingToken || null, a;
	}
	_getIdTokenResponse(e) {
		return vi(e, this.buildRequest());
	}
	_linkToIdToken(e, t) {
		let n = this.buildRequest();
		return n.idToken = t, vi(e, n);
	}
	_getReauthenticationResolver(e) {
		let t = this.buildRequest();
		return t.autoCreate = !1, vi(e, t);
	}
	buildRequest() {
		let e = {
			requestUri: yi,
			returnSecureToken: !0
		};
		if (this.pendingToken) e.pendingToken = this.pendingToken;
		else {
			let t = {};
			this.idToken && (t.id_token = this.idToken), this.accessToken && (t.access_token = this.accessToken), this.secret && (t.oauth_token_secret = this.secret), t.providerId = this.providerId, this.nonce && !this.pendingToken && (t.nonce = this.nonce), e.postBody = _e(t);
		}
		return e;
	}
};
function xi(e) {
	switch (e) {
		case "recoverEmail": return "RECOVER_EMAIL";
		case "resetPassword": return "PASSWORD_RESET";
		case "signIn": return "EMAIL_SIGNIN";
		case "verifyEmail": return "VERIFY_EMAIL";
		case "verifyAndChangeEmail": return "VERIFY_AND_CHANGE_EMAIL";
		case "revertSecondFactorAddition": return "REVERT_SECOND_FACTOR_ADDITION";
		default: return null;
	}
}
function Si(e) {
	let t = ve(ye(e)).link, n = t ? ve(ye(t)).deep_link_id : null, r = ve(ye(e)).deep_link_id;
	return (r ? ve(ye(r)).link : null) || r || n || t || e;
}
var Ci = class e {
	constructor(e) {
		let t = ve(ye(e)), n = t.apiKey ?? null, r = t.oobCode ?? null, i = xi(t.mode ?? null);
		S(n && r && i, "argument-error"), this.apiKey = n, this.operation = i, this.code = r, this.continueUrl = t.continueUrl ?? null, this.languageCode = t.lang ?? null, this.tenantId = t.tenantId ?? null;
	}
	static parseLink(t) {
		let n = Si(t);
		try {
			return new e(n);
		} catch {
			return null;
		}
	}
}, wi = class e {
	constructor() {
		this.providerId = e.PROVIDER_ID;
	}
	static credential(e, t) {
		return _i._fromEmailAndPassword(e, t);
	}
	static credentialWithLink(e, t) {
		let n = Ci.parseLink(t);
		return S(n, "argument-error"), _i._fromEmailAndCode(e, n.code, n.tenantId);
	}
};
wi.PROVIDER_ID = "password", wi.EMAIL_PASSWORD_SIGN_IN_METHOD = "password", wi.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
var Ti = class {
	constructor(e) {
		this.providerId = e, this.defaultLanguageCode = null, this.customParameters = {};
	}
	setDefaultLanguage(e) {
		this.defaultLanguageCode = e;
	}
	setCustomParameters(e) {
		return this.customParameters = e, this;
	}
	getCustomParameters() {
		return this.customParameters;
	}
}, Ei = class extends Ti {
	constructor() {
		super(...arguments), this.scopes = [];
	}
	addScope(e) {
		return this.scopes.includes(e) || this.scopes.push(e), this;
	}
	getScopes() {
		return [...this.scopes];
	}
}, Di = class e extends Ei {
	constructor() {
		super("facebook.com");
	}
	static credential(t) {
		return bi._fromParams({
			providerId: e.PROVIDER_ID,
			signInMethod: e.FACEBOOK_SIGN_IN_METHOD,
			accessToken: t
		});
	}
	static credentialFromResult(t) {
		return e.credentialFromTaggedObject(t);
	}
	static credentialFromError(t) {
		return e.credentialFromTaggedObject(t.customData || {});
	}
	static credentialFromTaggedObject({ _tokenResponse: t }) {
		if (!t || !("oauthAccessToken" in t) || !t.oauthAccessToken) return null;
		try {
			return e.credential(t.oauthAccessToken);
		} catch {
			return null;
		}
	}
};
Di.FACEBOOK_SIGN_IN_METHOD = "facebook.com", Di.PROVIDER_ID = "facebook.com";
var Oi = class e extends Ei {
	constructor() {
		super("google.com"), this.addScope("profile");
	}
	static credential(t, n) {
		return bi._fromParams({
			providerId: e.PROVIDER_ID,
			signInMethod: e.GOOGLE_SIGN_IN_METHOD,
			idToken: t,
			accessToken: n
		});
	}
	static credentialFromResult(t) {
		return e.credentialFromTaggedObject(t);
	}
	static credentialFromError(t) {
		return e.credentialFromTaggedObject(t.customData || {});
	}
	static credentialFromTaggedObject({ _tokenResponse: t }) {
		if (!t) return null;
		let { oauthIdToken: n, oauthAccessToken: r } = t;
		if (!n && !r) return null;
		try {
			return e.credential(n, r);
		} catch {
			return null;
		}
	}
};
Oi.GOOGLE_SIGN_IN_METHOD = "google.com", Oi.PROVIDER_ID = "google.com";
var ki = class e extends Ei {
	constructor() {
		super("github.com");
	}
	static credential(t) {
		return bi._fromParams({
			providerId: e.PROVIDER_ID,
			signInMethod: e.GITHUB_SIGN_IN_METHOD,
			accessToken: t
		});
	}
	static credentialFromResult(t) {
		return e.credentialFromTaggedObject(t);
	}
	static credentialFromError(t) {
		return e.credentialFromTaggedObject(t.customData || {});
	}
	static credentialFromTaggedObject({ _tokenResponse: t }) {
		if (!t || !("oauthAccessToken" in t) || !t.oauthAccessToken) return null;
		try {
			return e.credential(t.oauthAccessToken);
		} catch {
			return null;
		}
	}
};
ki.GITHUB_SIGN_IN_METHOD = "github.com", ki.PROVIDER_ID = "github.com";
var Ai = class e extends Ei {
	constructor() {
		super("twitter.com");
	}
	static credential(t, n) {
		return bi._fromParams({
			providerId: e.PROVIDER_ID,
			signInMethod: e.TWITTER_SIGN_IN_METHOD,
			oauthToken: t,
			oauthTokenSecret: n
		});
	}
	static credentialFromResult(t) {
		return e.credentialFromTaggedObject(t);
	}
	static credentialFromError(t) {
		return e.credentialFromTaggedObject(t.customData || {});
	}
	static credentialFromTaggedObject({ _tokenResponse: t }) {
		if (!t) return null;
		let { oauthAccessToken: n, oauthTokenSecret: r } = t;
		if (!n || !r) return null;
		try {
			return e.credential(n, r);
		} catch {
			return null;
		}
	}
};
Ai.TWITTER_SIGN_IN_METHOD = "twitter.com", Ai.PROVIDER_ID = "twitter.com";
var ji = class e {
	constructor(e) {
		this.user = e.user, this.providerId = e.providerId, this._tokenResponse = e._tokenResponse, this.operationType = e.operationType;
	}
	static async _fromIdTokenResponse(t, n, r, i = !1) {
		let a = await vr._fromIdTokenResponse(t, r, i), o = Mi(r);
		return new e({
			user: a,
			providerId: o,
			_tokenResponse: r,
			operationType: n
		});
	}
	static async _forOperation(t, n, r) {
		await t._updateTokensIfNecessary(r, !0);
		let i = Mi(r);
		return new e({
			user: t,
			providerId: i,
			_tokenResponse: r,
			operationType: n
		});
	}
};
function Mi(e) {
	return e.providerId ? e.providerId : "phoneNumber" in e ? "phone" : null;
}
var Ni = class e extends de {
	constructor(t, n, r, i) {
		super(n.code, n.message), this.operationType = r, this.user = i, Object.setPrototypeOf(this, e.prototype), this.customData = {
			appName: t.name,
			tenantId: t.tenantId ?? void 0,
			_serverResponse: n.customData._serverResponse,
			operationType: r
		};
	}
	static _fromErrorAndOperation(t, n, r, i) {
		return new e(t, n, r, i);
	}
};
function Pi(e, t, n, r) {
	return (t === "reauthenticate" ? n._getReauthenticationResolver(e) : n._getIdTokenResponse(e)).catch((n) => {
		throw n.code === "auth/multi-factor-auth-required" ? Ni._fromErrorAndOperation(e, n, t, r) : n;
	});
}
async function Fi(e, t, n = !1) {
	let r = await or(e, t._linkToIdToken(e.auth, await e.getIdToken()), n);
	return ji._forOperation(e, "link", r);
}
async function Ii(e, t, n = !1) {
	let { auth: r } = e;
	if (Jt(r.app)) return Promise.reject(Dn(r));
	let i = "reauthenticate";
	try {
		let a = await or(e, Pi(r, i, t, e), n);
		S(a.idToken, r, "internal-error");
		let o = ir(a.idToken);
		S(o, r, "internal-error");
		let { sub: s } = o;
		return S(e.uid === s, r, "user-mismatch"), ji._forOperation(e, i, a);
	} catch (e) {
		throw e?.code === "auth/user-not-found" && x(r, "user-mismatch"), e;
	}
}
async function Li(e, t, n = !1) {
	if (Jt(e.app)) return Promise.reject(Dn(e));
	let r = "signIn", i = await Pi(e, r, t), a = await ji._fromIdTokenResponse(e, r, i);
	return n || await e._updateCurrentUser(a.user), a;
}
async function Ri(e, t) {
	return Li(Ur(e), t);
}
async function zi(e) {
	let t = Ur(e);
	t._getPasswordPolicyInternal() && await t._updatePasswordPolicy();
}
function Bi(e, t, n) {
	return Jt(e.app) ? Promise.reject(Dn(e)) : Ri(we(e), wi.credential(t, n)).catch(async (t) => {
		throw t.code === "auth/password-does-not-meet-requirements" && zi(e), t;
	});
}
function Vi(e, t, n, r) {
	return we(e).onIdTokenChanged(t, n, r);
}
function Hi(e, t, n) {
	return we(e).beforeAuthStateChanged(t, n);
}
function Ui(e, t, n, r) {
	return we(e).onAuthStateChanged(t, n, r);
}
function Wi(e) {
	return we(e).signOut();
}
var Gi = "__sak", Ki = class {
	constructor(e, t) {
		this.storageRetriever = e, this.type = t;
	}
	_isAvailable() {
		try {
			return this.storage ? (this.storage.setItem(Gi, "1"), this.storage.removeItem(Gi), Promise.resolve(!0)) : Promise.resolve(!1);
		} catch {
			return Promise.resolve(!1);
		}
	}
	_set(e, t) {
		return this.storage.setItem(e, JSON.stringify(t)), Promise.resolve();
	}
	_get(e) {
		let t = this.storage.getItem(e);
		return Promise.resolve(t ? JSON.parse(t) : null);
	}
	_remove(e) {
		return this.storage.removeItem(e), Promise.resolve();
	}
	get storage() {
		return this.storageRetriever();
	}
}, qi = 1e3, Ji = 10, Yi = class extends Ki {
	constructor() {
		super(() => window.localStorage, "LOCAL"), this.boundEventHandler = (e, t) => this.onStorageEvent(e, t), this.listeners = {}, this.localCache = {}, this.pollTimer = null, this.fallbackToPolling = Ir(), this._shouldAllowMigration = !0;
	}
	forAllChangedKeys(e) {
		for (let t of Object.keys(this.listeners)) {
			let n = this.storage.getItem(t), r = this.localCache[t];
			n !== r && e(t, r, n);
		}
	}
	onStorageEvent(e, t = !1) {
		if (!e.key) {
			this.forAllChangedKeys((e, t, n) => {
				this.notifyListeners(e, n);
			});
			return;
		}
		let n = e.key;
		t ? this.detachListener() : this.stopPolling();
		let r = () => {
			let e = this.storage.getItem(n);
			!t && this.localCache[n] === e || this.notifyListeners(n, e);
		}, i = this.storage.getItem(n);
		Fr() && i !== e.newValue && e.newValue !== e.oldValue ? setTimeout(r, Ji) : r();
	}
	notifyListeners(e, t) {
		this.localCache[e] = t;
		let n = this.listeners[e];
		if (n) for (let e of Array.from(n)) e(t && JSON.parse(t));
	}
	startPolling() {
		this.stopPolling(), this.pollTimer = setInterval(() => {
			this.forAllChangedKeys((e, t, n) => {
				this.onStorageEvent(new StorageEvent("storage", {
					key: e,
					oldValue: t,
					newValue: n
				}), !0);
			});
		}, qi);
	}
	stopPolling() {
		this.pollTimer &&= (clearInterval(this.pollTimer), null);
	}
	attachListener() {
		window.addEventListener("storage", this.boundEventHandler);
	}
	detachListener() {
		window.removeEventListener("storage", this.boundEventHandler);
	}
	_addListener(e, t) {
		Object.keys(this.listeners).length === 0 && (this.fallbackToPolling ? this.startPolling() : this.attachListener()), this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set(), this.localCache[e] = this.storage.getItem(e)), this.listeners[e].add(t);
	}
	_removeListener(e, t) {
		this.listeners[e] && (this.listeners[e].delete(t), this.listeners[e].size === 0 && delete this.listeners[e]), Object.keys(this.listeners).length === 0 && (this.detachListener(), this.stopPolling());
	}
	async _set(e, t) {
		await super._set(e, t), this.localCache[e] = JSON.stringify(t);
	}
	async _get(e) {
		let t = await super._get(e);
		return this.localCache[e] = JSON.stringify(t), t;
	}
	async _remove(e) {
		await super._remove(e), delete this.localCache[e];
	}
};
Yi.type = "LOCAL";
var Xi = Yi, Zi = class extends Ki {
	constructor() {
		super(() => window.sessionStorage, "SESSION");
	}
	_addListener(e, t) {}
	_removeListener(e, t) {}
};
Zi.type = "SESSION";
var Qi = Zi;
function $i(e) {
	return Promise.all(e.map(async (e) => {
		try {
			return {
				fulfilled: !0,
				value: await e
			};
		} catch (e) {
			return {
				fulfilled: !1,
				reason: e
			};
		}
	}));
}
var ea = class e {
	constructor(e) {
		this.eventTarget = e, this.handlersMap = {}, this.boundEventHandler = this.handleEvent.bind(this);
	}
	static _getInstance(t) {
		let n = this.receivers.find((e) => e.isListeningto(t));
		if (n) return n;
		let r = new e(t);
		return this.receivers.push(r), r;
	}
	isListeningto(e) {
		return this.eventTarget === e;
	}
	async handleEvent(e) {
		let t = e, { eventId: n, eventType: r, data: i } = t.data, a = this.handlersMap[r];
		if (!a?.size) return;
		t.ports[0].postMessage({
			status: "ack",
			eventId: n,
			eventType: r
		});
		let o = await $i(Array.from(a).map(async (e) => e(t.origin, i)));
		t.ports[0].postMessage({
			status: "done",
			eventId: n,
			eventType: r,
			response: o
		});
	}
	_subscribe(e, t) {
		Object.keys(this.handlersMap).length === 0 && this.eventTarget.addEventListener("message", this.boundEventHandler), this.handlersMap[e] || (this.handlersMap[e] = /* @__PURE__ */ new Set()), this.handlersMap[e].add(t);
	}
	_unsubscribe(e, t) {
		this.handlersMap[e] && t && this.handlersMap[e].delete(t), (!t || this.handlersMap[e].size === 0) && delete this.handlersMap[e], Object.keys(this.handlersMap).length === 0 && this.eventTarget.removeEventListener("message", this.boundEventHandler);
	}
};
ea.receivers = [];
function ta(e = "", t = 10) {
	let n = "";
	for (let e = 0; e < t; e++) n += Math.floor(Math.random() * 10);
	return e + n;
}
var na = class {
	constructor(e) {
		this.target = e, this.handlers = /* @__PURE__ */ new Set();
	}
	removeMessageHandler(e) {
		e.messageChannel && (e.messageChannel.port1.removeEventListener("message", e.onMessage), e.messageChannel.port1.close()), this.handlers.delete(e);
	}
	async _send(e, t, n = 50) {
		let r = typeof MessageChannel < "u" ? new MessageChannel() : null;
		if (!r) throw Error("connection_unavailable");
		let i, a;
		return new Promise((o, s) => {
			let c = ta("", 20);
			r.port1.start();
			let l = setTimeout(() => {
				s(/* @__PURE__ */ Error("unsupported_event"));
			}, n);
			a = {
				messageChannel: r,
				onMessage(e) {
					let t = e;
					if (t.data.eventId === c) switch (t.data.status) {
						case "ack":
							clearTimeout(l), i = setTimeout(() => {
								s(/* @__PURE__ */ Error("timeout"));
							}, 3e3);
							break;
						case "done":
							clearTimeout(i), o(t.data.response);
							break;
						default: clearTimeout(l), clearTimeout(i), s(/* @__PURE__ */ Error("invalid_response"));
					}
				}
			}, this.handlers.add(a), r.port1.addEventListener("message", a.onMessage), this.target.postMessage({
				eventType: e,
				eventId: c,
				data: t
			}, [r.port2]);
		}).finally(() => {
			a && this.removeMessageHandler(a);
		});
	}
};
function ra() {
	return window;
}
function ia(e) {
	ra().location.href = e;
}
function aa() {
	return ra().WorkerGlobalScope !== void 0 && typeof ra().importScripts == "function";
}
async function oa() {
	if (!navigator?.serviceWorker) return null;
	try {
		return (await navigator.serviceWorker.ready).active;
	} catch {
		return null;
	}
}
function sa() {
	return navigator?.serviceWorker?.controller || null;
}
function ca() {
	return aa() ? self : null;
}
var la = "firebaseLocalStorageDb", ua = 1, da = "firebaseLocalStorage", fa = "fbase_key", pa = class {
	constructor(e) {
		this.request = e;
	}
	toPromise() {
		return new Promise((e, t) => {
			this.request.addEventListener("success", () => {
				e(this.request.result);
			}), this.request.addEventListener("error", () => {
				t(this.request.error);
			});
		});
	}
};
function ma(e, t) {
	return e.transaction([da], t ? "readwrite" : "readonly").objectStore(da);
}
function ha() {
	return new pa(indexedDB.deleteDatabase(la)).toPromise();
}
function ga() {
	let e = indexedDB.open(la, ua);
	return new Promise((t, n) => {
		e.addEventListener("error", () => {
			n(e.error);
		}), e.addEventListener("upgradeneeded", () => {
			let t = e.result;
			try {
				t.createObjectStore(da, { keyPath: fa });
			} catch (e) {
				n(e);
			}
		}), e.addEventListener("success", async () => {
			let n = e.result;
			n.objectStoreNames.contains(da) ? t(n) : (n.close(), await ha(), t(await ga()));
		});
	});
}
async function _a(e, t, n) {
	return new pa(ma(e, !0).put({
		[fa]: t,
		value: n
	})).toPromise();
}
async function va(e, t) {
	let n = await new pa(ma(e, !1).get(t)).toPromise();
	return n === void 0 ? null : n.value;
}
function ya(e, t) {
	return new pa(ma(e, !0).delete(t)).toPromise();
}
var ba = 800, xa = 3, Sa = class {
	registerLifecycleListeners() {
		typeof window < "u" && typeof window.addEventListener == "function" && (window.addEventListener("pagehide", this.onPageHide), window.addEventListener("pageshow", this.onPageShow));
	}
	unregisterLifecycleListeners() {
		typeof window < "u" && typeof window.removeEventListener == "function" && (window.removeEventListener("pagehide", this.onPageHide), window.removeEventListener("pageshow", this.onPageShow));
	}
	constructor() {
		this.type = "LOCAL", this.dbPromise = null, this._shouldAllowMigration = !0, this.listeners = {}, this.localCache = {}, this.pollTimer = null, this.isClosing = !1, this.pendingWrites = 0, this.receiver = null, this.sender = null, this.serviceWorkerReceiverAvailable = !1, this.activeServiceWorker = null, this.onPageHide = () => {
			this.isClosing = !0, this.stopPolling(), this.dbPromise &&= (this.dbPromise.then((e) => e.close()).catch(() => {}), null);
		}, this.onPageShow = () => {
			this.isClosing && (this.isClosing = !1, Object.keys(this.listeners).length > 0 && this.startPolling());
		}, this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {}, () => {});
	}
	async _openDb() {
		return this.dbPromise ? this.dbPromise : (this.dbPromise = ga(), this.dbPromise.catch(() => {
			this.dbPromise = null;
		}), this.dbPromise);
	}
	async _withRetries(e) {
		let t = 0;
		for (;;) try {
			return await e(await this._openDb());
		} catch (e) {
			if (t++ > xa) throw e;
			if (this.dbPromise) {
				let e = this.dbPromise;
				this.dbPromise = null;
				try {
					(await e).close();
				} catch {}
			}
		}
	}
	async initializeServiceWorkerMessaging() {
		return aa() ? this.initializeReceiver() : this.initializeSender();
	}
	async initializeReceiver() {
		this.receiver = ea._getInstance(ca()), this.receiver._subscribe("keyChanged", async (e, t) => ({ keyProcessed: (await this._poll()).includes(t.key) })), this.receiver._subscribe("ping", async (e, t) => ["keyChanged"]);
	}
	async initializeSender() {
		if (this.activeServiceWorker = await oa(), !this.activeServiceWorker) return;
		this.sender = new na(this.activeServiceWorker);
		let e = await this.sender._send("ping", {}, 800);
		e && e[0]?.fulfilled && e[0]?.value.includes("keyChanged") && (this.serviceWorkerReceiverAvailable = !0);
	}
	async notifyServiceWorker(e) {
		if (!(!this.sender || !this.activeServiceWorker || sa() !== this.activeServiceWorker)) try {
			await this.sender._send("keyChanged", { key: e }, this.serviceWorkerReceiverAvailable ? 800 : 50);
		} catch {}
	}
	async _isAvailable() {
		try {
			return indexedDB ? (await this._withRetries(async (e) => {
				await _a(e, Gi, "1"), await ya(e, Gi);
			}), !0) : !1;
		} catch {}
		return !1;
	}
	async _withPendingWrite(e) {
		this.pendingWrites++;
		try {
			await e();
		} finally {
			this.pendingWrites--;
		}
	}
	async _set(e, t) {
		return this._withPendingWrite(async () => (await this._withRetries((n) => _a(n, e, t)), this.localCache[e] = t, this.notifyServiceWorker(e)));
	}
	async _get(e) {
		let t = await this._withRetries((t) => va(t, e));
		return this.localCache[e] = t, t;
	}
	async _remove(e) {
		return this._withPendingWrite(async () => (await this._withRetries((t) => ya(t, e)), delete this.localCache[e], this.notifyServiceWorker(e)));
	}
	async _poll() {
		if (this.isClosing) return [];
		try {
			let e = await this._withRetries((e) => new pa(ma(e, !1).getAll()).toPromise());
			if (this.isClosing || !e || this.pendingWrites !== 0) return [];
			let t = [], n = /* @__PURE__ */ new Set();
			if (e.length !== 0) for (let { fbase_key: r, value: i } of e) n.add(r), JSON.stringify(this.localCache[r]) !== JSON.stringify(i) && (this.notifyListeners(r, i), t.push(r));
			for (let e of Object.keys(this.localCache)) this.localCache[e] && !n.has(e) && (this.notifyListeners(e, null), t.push(e));
			return t;
		} catch (e) {
			return this.isClosing || Cn(`Firebase Auth cross-tab polling failed with error: ${e}`), [];
		}
	}
	notifyListeners(e, t) {
		this.localCache[e] = t;
		let n = this.listeners[e];
		if (n) for (let e of Array.from(n)) e(t);
	}
	startPolling() {
		this.stopPolling(), this.pollTimer = setInterval(async () => this._poll(), ba);
	}
	stopPolling() {
		this.pollTimer &&= (clearInterval(this.pollTimer), null);
	}
	_addListener(e, t) {
		Object.keys(this.listeners).length === 0 && (this.startPolling(), this.registerLifecycleListeners()), this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set(), this._get(e)), this.listeners[e].add(t);
	}
	_removeListener(e, t) {
		this.listeners[e] && (this.listeners[e].delete(t), this.listeners[e].size === 0 && delete this.listeners[e]), Object.keys(this.listeners).length === 0 && (this.stopPolling(), this.unregisterLifecycleListeners());
	}
};
Sa.type = "LOCAL";
var Ca = Sa;
Xr("rcb"), new In(3e4, 6e4);
function wa(e, t) {
	return t ? br(t) : (S(e._popupRedirectResolver, e, "argument-error"), e._popupRedirectResolver);
}
var Ta = class extends fi {
	constructor(e) {
		super("custom", "custom"), this.params = e;
	}
	_getIdTokenResponse(e) {
		return vi(e, this._buildIdpRequest());
	}
	_linkToIdToken(e, t) {
		return vi(e, this._buildIdpRequest(t));
	}
	_getReauthenticationResolver(e) {
		return vi(e, this._buildIdpRequest());
	}
	_buildIdpRequest(e) {
		let t = {
			requestUri: this.params.requestUri,
			sessionId: this.params.sessionId,
			postBody: this.params.postBody,
			tenantId: this.params.tenantId,
			pendingToken: this.params.pendingToken,
			returnSecureToken: !0,
			returnIdpCredential: !0
		};
		return e && (t.idToken = e), t;
	}
};
function Ea(e) {
	return Li(e.auth, new Ta(e), e.bypassAuthState);
}
function Da(e) {
	let { auth: t, user: n } = e;
	return S(n, t, "internal-error"), Ii(n, new Ta(e), e.bypassAuthState);
}
async function Oa(e) {
	let { auth: t, user: n } = e;
	return S(n, t, "internal-error"), Fi(n, new Ta(e), e.bypassAuthState);
}
var ka = class {
	constructor(e, t, n, r, i = !1) {
		this.auth = e, this.resolver = n, this.user = r, this.bypassAuthState = i, this.pendingPromise = null, this.eventManager = null, this.filter = Array.isArray(t) ? t : [t];
	}
	execute() {
		return new Promise(async (e, t) => {
			this.pendingPromise = {
				resolve: e,
				reject: t
			};
			try {
				this.eventManager = await this.resolver._initialize(this.auth), await this.onExecution(), this.eventManager.registerConsumer(this);
			} catch (e) {
				this.reject(e);
			}
		});
	}
	async onAuthEvent(e) {
		let { urlResponse: t, sessionId: n, postBody: r, tenantId: i, error: a, type: o } = e;
		if (a) {
			this.reject(a);
			return;
		}
		let s = {
			auth: this.auth,
			requestUri: t,
			sessionId: n,
			tenantId: i || void 0,
			postBody: r || void 0,
			user: this.user,
			bypassAuthState: this.bypassAuthState
		};
		try {
			this.resolve(await this.getIdpTask(o)(s));
		} catch (e) {
			this.reject(e);
		}
	}
	onError(e) {
		this.reject(e);
	}
	getIdpTask(e) {
		switch (e) {
			case "signInViaPopup":
			case "signInViaRedirect": return Ea;
			case "linkViaPopup":
			case "linkViaRedirect": return Oa;
			case "reauthViaPopup":
			case "reauthViaRedirect": return Da;
			default: x(this.auth, "internal-error");
		}
	}
	resolve(e) {
		An(this.pendingPromise, "Pending promise was never set"), this.pendingPromise.resolve(e), this.unregisterAndCleanUp();
	}
	reject(e) {
		An(this.pendingPromise, "Pending promise was never set"), this.pendingPromise.reject(e), this.unregisterAndCleanUp();
	}
	unregisterAndCleanUp() {
		this.eventManager && this.eventManager.unregisterConsumer(this), this.pendingPromise = null, this.cleanUp();
	}
}, Aa = new In(2e3, 1e4), ja = class e extends ka {
	constructor(t, n, r, i, a) {
		super(t, n, i, a), this.provider = r, this.authWindow = null, this.pollId = null, e.currentPopupAction && e.currentPopupAction.cancel(), e.currentPopupAction = this;
	}
	async executeNotNull() {
		let e = await this.execute();
		return S(e, this.auth, "internal-error"), e;
	}
	async onExecution() {
		An(this.filter.length === 1, "Popup operations only handle one event");
		let e = ta();
		this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], e), this.authWindow.associatedEvent = e, this.resolver._originValidation(this.auth).catch((e) => {
			this.reject(e);
		}), this.resolver._isIframeWebStorageSupported(this.auth, (e) => {
			e || this.reject(Tn(this.auth, "web-storage-unsupported"));
		}), this.pollUserCancellation();
	}
	get eventId() {
		return this.authWindow?.associatedEvent || null;
	}
	cancel() {
		this.reject(Tn(this.auth, "cancelled-popup-request"));
	}
	cleanUp() {
		this.authWindow && this.authWindow.close(), this.pollId && window.clearTimeout(this.pollId), this.authWindow = null, this.pollId = null, e.currentPopupAction = null;
	}
	pollUserCancellation() {
		let e = () => {
			if (this.authWindow?.window?.closed) {
				this.pollId = window.setTimeout(() => {
					this.pollId = null, this.reject(Tn(this.auth, "popup-closed-by-user"));
				}, 8e3);
				return;
			}
			this.pollId = window.setTimeout(e, Aa.get());
		};
		e();
	}
};
ja.currentPopupAction = null;
var Ma = "pendingRedirect", Na = /* @__PURE__ */ new Map(), Pa = class extends ka {
	constructor(e, t, n = !1) {
		super(e, [
			"signInViaRedirect",
			"linkViaRedirect",
			"reauthViaRedirect",
			"unknown"
		], t, void 0, n), this.eventId = null;
	}
	async execute() {
		let e = Na.get(this.auth._key());
		if (!e) {
			try {
				let t = await Fa(this.resolver, this.auth) ? await super.execute() : null;
				e = () => Promise.resolve(t);
			} catch (t) {
				e = () => Promise.reject(t);
			}
			Na.set(this.auth._key(), e);
		}
		return this.bypassAuthState || Na.set(this.auth._key(), () => Promise.resolve(null)), e();
	}
	async onAuthEvent(e) {
		if (e.type === "signInViaRedirect") return super.onAuthEvent(e);
		if (e.type === "unknown") {
			this.resolve(null);
			return;
		}
		if (e.eventId) {
			let t = await this.auth._redirectUserForId(e.eventId);
			if (t) return this.user = t, super.onAuthEvent(e);
			this.resolve(null);
		}
	}
	async onExecution() {}
	cleanUp() {}
};
async function Fa(e, t) {
	let n = Ra(t), r = La(e);
	if (!await r._isAvailable()) return !1;
	let i = await r._get(n) === "true";
	return await r._remove(n), i;
}
function Ia(e, t) {
	Na.set(e._key(), t);
}
function La(e) {
	return br(e._redirectPersistence);
}
function Ra(e) {
	return Cr(Ma, e.config.apiKey, e.name);
}
async function za(e, t, n = !1) {
	if (Jt(e.app)) return Promise.reject(Dn(e));
	let r = Ur(e), i = await new Pa(r, wa(r, t), n).execute();
	return i && !n && (delete i.user._redirectEventId, await r._persistUserIfCurrent(i.user), await r._setRedirectUser(null, t)), i;
}
var Ba = 6e5, Va = class {
	constructor(e) {
		this.auth = e, this.cachedEventUids = /* @__PURE__ */ new Set(), this.consumers = /* @__PURE__ */ new Set(), this.queuedRedirectEvent = null, this.hasHandledPotentialRedirect = !1, this.lastProcessedEventTime = Date.now();
	}
	registerConsumer(e) {
		this.consumers.add(e), this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, e) && (this.sendToConsumer(this.queuedRedirectEvent, e), this.saveEventToCache(this.queuedRedirectEvent), this.queuedRedirectEvent = null);
	}
	unregisterConsumer(e) {
		this.consumers.delete(e);
	}
	onEvent(e) {
		if (this.hasEventBeenHandled(e)) return !1;
		let t = !1;
		return this.consumers.forEach((n) => {
			this.isEventForConsumer(e, n) && (t = !0, this.sendToConsumer(e, n), this.saveEventToCache(e));
		}), this.hasHandledPotentialRedirect || !Wa(e) ? t : (this.hasHandledPotentialRedirect = !0, t ||= (this.queuedRedirectEvent = e, !0), t);
	}
	sendToConsumer(e, t) {
		if (e.error && !Ua(e)) {
			let n = e.error.code?.split("auth/")[1] || "internal-error";
			t.onError(Tn(this.auth, n));
		} else t.onAuthEvent(e);
	}
	isEventForConsumer(e, t) {
		let n = t.eventId === null || !!e.eventId && e.eventId === t.eventId;
		return t.filter.includes(e.type) && n;
	}
	hasEventBeenHandled(e) {
		return Date.now() - this.lastProcessedEventTime >= Ba && this.cachedEventUids.clear(), this.cachedEventUids.has(Ha(e));
	}
	saveEventToCache(e) {
		this.cachedEventUids.add(Ha(e)), this.lastProcessedEventTime = Date.now();
	}
};
function Ha(e) {
	return [
		e.type,
		e.eventId,
		e.sessionId,
		e.tenantId
	].filter((e) => e).join("-");
}
function Ua({ type: e, error: t }) {
	return e === "unknown" && t?.code === "auth/no-auth-event";
}
function Wa(e) {
	switch (e.type) {
		case "signInViaRedirect":
		case "linkViaRedirect":
		case "reauthViaRedirect": return !0;
		case "unknown": return Ua(e);
		default: return !1;
	}
}
async function Ga(e, t = {}) {
	return Un(e, "GET", "/v1/projects", t);
}
var Ka = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, qa = /^https?/;
async function Ja(e) {
	if (e.config.emulator) return;
	let { authorizedDomains: t } = await Ga(e);
	for (let e of t) try {
		if (Ya(e)) return;
	} catch {}
	x(e, "unauthorized-domain");
}
function Ya(e) {
	let t = jn(), { protocol: n, hostname: r } = new URL(t);
	if (e.startsWith("chrome-extension://")) {
		let i = new URL(e);
		return i.hostname === "" && r === "" ? n === "chrome-extension:" && e.replace("chrome-extension://", "") === t.replace("chrome-extension://", "") : n === "chrome-extension:" && i.hostname === r;
	}
	if (!qa.test(n)) return !1;
	if (Ka.test(e)) return r === e;
	let i = e.replace(/\./g, "\\.");
	return RegExp("^(.+\\." + i + "|" + i + ")$", "i").test(r);
}
var Xa = new In(3e4, 6e4);
function Za() {
	let e = ra().___jsl;
	if (e?.H) {
		for (let t of Object.keys(e.H)) if (e.H[t].r = e.H[t].r || [], e.H[t].L = e.H[t].L || [], e.H[t].r = [...e.H[t].L], e.CP) for (let t = 0; t < e.CP.length; t++) e.CP[t] = null;
	}
}
function Qa(e) {
	return new Promise((t, n) => {
		function r() {
			Za(), gapi.load("gapi.iframes", {
				callback: () => {
					t(gapi.iframes.getContext());
				},
				ontimeout: () => {
					Za(), n(Tn(e, "network-request-failed"));
				},
				timeout: Xa.get()
			});
		}
		if (ra().gapi?.iframes?.Iframe) t(gapi.iframes.getContext());
		else if (ra().gapi?.load) r();
		else {
			let t = Xr("iframefcb");
			return ra()[t] = () => {
				gapi.load ? r() : n(Tn(e, "network-request-failed"));
			}, qr(`${Yr()}?onload=${t}`).catch((e) => n(e));
		}
	}).catch((e) => {
		throw $a = null, e;
	});
}
var $a = null;
function eo(e) {
	return $a ||= Qa(e), $a;
}
var to = new In(5e3, 15e3), no = "__/auth/iframe", ro = "emulator/auth/iframe", io = {
	style: {
		position: "absolute",
		top: "-100px",
		width: "1px",
		height: "1px"
	},
	"aria-hidden": "true",
	tabindex: "-1"
}, ao = /* @__PURE__ */ new Map([
	["identitytoolkit.googleapis.com", "p"],
	["staging-identitytoolkit.sandbox.googleapis.com", "s"],
	["test-identitytoolkit.sandbox.googleapis.com", "t"]
]);
function oo(e) {
	let t = e.config;
	S(t.authDomain, e, "auth-domain-config-required");
	let n = t.emulator ? Ln(t, ro) : `https://${e.config.authDomain}/${no}`, r = {
		apiKey: t.apiKey,
		appName: e.name,
		v: Xt
	}, i = ao.get(e.config.apiHost);
	i && (r.eid = i);
	let a = e._getFrameworks();
	return a.length && (r.fw = a.join(",")), `${n}?${_e(r).slice(1)}`;
}
async function so(e) {
	let t = await eo(e), n = ra().gapi;
	return S(n, e, "internal-error"), t.open({
		where: document.body,
		url: oo(e),
		messageHandlersFilter: n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
		attributes: io,
		dontclear: !0
	}, (t) => new Promise(async (n, r) => {
		await t.restyle({ setHideOnLeave: !1 });
		let i = Tn(e, "network-request-failed"), a = ra().setTimeout(() => {
			r(i);
		}, to.get());
		function o() {
			ra().clearTimeout(a), n(t);
		}
		t.ping(o).then(o, () => {
			r(i);
		});
	}));
}
var co = {
	location: "yes",
	resizable: "yes",
	statusbar: "yes",
	toolbar: "no"
}, lo = 500, uo = 600, fo = "_blank", po = "http://localhost", mo = class {
	constructor(e) {
		this.window = e, this.associatedEvent = null;
	}
	close() {
		if (this.window) try {
			this.window.close();
		} catch {}
	}
};
function ho(e, t, n, r = lo, i = uo) {
	let a = Math.max((window.screen.availHeight - i) / 2, 0).toString(), o = Math.max((window.screen.availWidth - r) / 2, 0).toString(), s = "", c = {
		...co,
		width: r.toString(),
		height: i.toString(),
		top: a,
		left: o
	}, l = v().toLowerCase();
	n && (s = Or(l) ? fo : n), Er(l) && (t ||= po, c.scrollbars = "yes");
	let u = Object.entries(c).reduce((e, [t, n]) => `${e}${t}=${n},`, "");
	if (Pr(l) && s !== "_self") return go(t || "", s), new mo(null);
	let d = window.open(t || "", s, u);
	S(d, e, "popup-blocked");
	try {
		d.focus();
	} catch {}
	return new mo(d);
}
function go(e, t) {
	let n = document.createElement("a");
	n.href = e, n.target = t;
	let r = document.createEvent("MouseEvent");
	r.initMouseEvent("click", !0, !0, window, 1, 0, 0, 0, 0, !1, !1, !1, !1, 1, null), n.dispatchEvent(r);
}
var _o = "__/auth/handler", vo = "emulator/auth/handler", yo = "fac";
async function bo(e, t, n, r, i, a) {
	S(e.config.authDomain, e, "auth-domain-config-required"), S(e.config.apiKey, e, "invalid-api-key");
	let o = {
		apiKey: e.config.apiKey,
		appName: e.name,
		authType: n,
		redirectUrl: r,
		v: Xt,
		eventId: i
	};
	if (t instanceof Ti) {
		t.setDefaultLanguage(e.languageCode), o.providerId = t.providerId || "", me(t.getCustomParameters()) || (o.customParameters = JSON.stringify(t.getCustomParameters()));
		for (let [e, t] of Object.entries(a || {})) o[e] = t;
	}
	if (t instanceof Ei) {
		let e = t.getScopes().filter((e) => e !== "");
		e.length > 0 && (o.scopes = e.join(","));
	}
	e.tenantId && (o.tid = e.tenantId);
	let s = o;
	for (let e of Object.keys(s)) s[e] === void 0 && delete s[e];
	let c = await e._getAppCheckToken(), l = c ? `#${yo}=${encodeURIComponent(c)}` : "";
	return `${xo(e)}?${_e(s).slice(1)}${l}`;
}
function xo({ config: e }) {
	return e.emulator ? Ln(e, vo) : `https://${e.authDomain}/${_o}`;
}
var So = "webStorageSupport", Co = class {
	constructor() {
		this.eventManagers = {}, this.iframes = {}, this.originValidationPromises = {}, this._redirectPersistence = Qi, this._completeRedirectFn = za, this._overrideRedirectResult = Ia;
	}
	async _openPopup(e, t, n, r) {
		return An(this.eventManagers[e._key()]?.manager, "_initialize() not called before _openPopup()"), ho(e, await bo(e, t, n, jn(), r), ta());
	}
	async _openRedirect(e, t, n, r) {
		return await this._originValidation(e), ia(await bo(e, t, n, jn(), r)), new Promise(() => {});
	}
	_initialize(e) {
		let t = e._key();
		if (this.eventManagers[t]) {
			let { manager: e, promise: n } = this.eventManagers[t];
			return e ? Promise.resolve(e) : (An(n, "If manager is not set, promise should be"), n);
		}
		let n = this.initAndGetManager(e);
		return this.eventManagers[t] = { promise: n }, n.catch(() => {
			delete this.eventManagers[t];
		}), n;
	}
	async initAndGetManager(e) {
		let t = await so(e), n = new Va(e);
		return t.register("authEvent", (t) => (S(t?.authEvent, e, "invalid-auth-event"), { status: n.onEvent(t.authEvent) ? "ACK" : "ERROR" }), gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER), this.eventManagers[e._key()] = { manager: n }, this.iframes[e._key()] = t, n;
	}
	_isIframeWebStorageSupported(e, t) {
		this.iframes[e._key()].send(So, { type: So }, (n) => {
			let r = n?.[0]?.[So];
			r !== void 0 && t(!!r), x(e, "internal-error");
		}, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
	}
	_originValidation(e) {
		let t = e._key();
		return this.originValidationPromises[t] || (this.originValidationPromises[t] = Ja(e)), this.originValidationPromises[t];
	}
	get _shouldInitProactively() {
		return Ir() || Dr() || Nr();
	}
}, wo = "@firebase/auth", To = "1.13.6", Eo = class {
	constructor(e) {
		this.auth = e, this.internalListeners = /* @__PURE__ */ new Map();
	}
	getUid() {
		return this.assertAuthConfigured(), this.auth.currentUser?.uid || null;
	}
	async getToken(e) {
		return this.assertAuthConfigured(), await this.auth._initializationPromise, this.auth.currentUser ? { accessToken: await this.auth.currentUser.getIdToken(e) } : null;
	}
	addAuthTokenListener(e) {
		if (this.assertAuthConfigured(), this.internalListeners.has(e)) return;
		let t = this.auth.onIdTokenChanged((t) => {
			e(t?.stsTokenManager.accessToken || null);
		});
		this.internalListeners.set(e, t), this.updateProactiveRefresh();
	}
	removeAuthTokenListener(e) {
		this.assertAuthConfigured();
		let t = this.internalListeners.get(e);
		t && (this.internalListeners.delete(e), t(), this.updateProactiveRefresh());
	}
	assertAuthConfigured() {
		S(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth");
	}
	updateProactiveRefresh() {
		this.internalListeners.size > 0 ? this.auth._startProactiveRefresh() : this.auth._stopProactiveRefresh();
	}
};
function Do(e) {
	switch (e) {
		case "Node": return "node";
		case "ReactNative": return "rn";
		case "Worker": return "webworker";
		case "Cordova": return "cordova";
		case "WebExtension": return "web-extension";
		default: return;
	}
}
function Oo(e) {
	Kt(new De("auth", (t, { options: n }) => {
		let r = t.getProvider("app").getImmediate(), i = t.getProvider("heartbeat"), a = t.getProvider("app-check-internal"), { apiKey: o, authDomain: s } = r.options;
		S(o && !o.includes(":"), "invalid-api-key", { appName: r.name });
		let c = new Hr(r, i, a, {
			apiKey: o,
			authDomain: s,
			clientPlatform: e,
			apiHost: "identitytoolkit.googleapis.com",
			tokenApiHost: "securetoken.googleapis.com",
			apiScheme: "https",
			sdkClientVersion: Lr(e)
		});
		return oi(c, n), c;
	}, "PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e, t, n) => {
		e.getProvider("auth-internal").initialize();
	})), Kt(new De("auth-internal", (e) => ((e) => new Eo(e))(Ur(e.getProvider("auth").getImmediate())), "PRIVATE").setInstantiationMode("EXPLICIT")), en(wo, To, Do(e)), en(wo, To, "esm2020");
}
var ko = g("authIdTokenMaxAge") || 300, Ao = null, jo = (e) => async (t) => {
	let n = t && await t.getIdTokenResult(), r = n && ((/* @__PURE__ */ new Date()).getTime() - Date.parse(n.issuedAtTime)) / 1e3;
	if (r && r > ko) return;
	let i = n?.token;
	Ao !== i && (Ao = i, await fetch(e, {
		method: i ? "POST" : "DELETE",
		headers: i ? { Authorization: `Bearer ${i}` } : {}
	}));
};
function Mo(e = Qt()) {
	let t = qt(e, "auth");
	if (t.isInitialized()) return t.getImmediate();
	let n = ai(e, {
		popupRedirectResolver: Co,
		persistence: [
			Ca,
			Xi,
			Qi
		]
	}), r = g("authTokenSyncURL");
	if (r && typeof isSecureContext == "boolean" && isSecureContext) {
		let e = new URL(r, location.origin);
		if (location.origin === e.origin) {
			let t = jo(e.toString());
			Hi(n, t, () => t(n.currentUser)), Vi(n, (e) => t(e));
		}
	}
	let i = p("auth");
	return i && si(n, `http://${i}`), n;
}
function No() {
	return document.getElementsByTagName("head")?.[0] ?? document;
}
Kr({
	loadJS(e) {
		return new Promise((t, n) => {
			let r = document.createElement("script");
			r.setAttribute("src", e), r.onload = t, r.onerror = (e) => {
				let t = Tn("internal-error");
				t.customData = e, n(t);
			}, r.type = "text/javascript", r.charset = "UTF-8", No().appendChild(r);
		});
	},
	gapiScript: "https://apis.google.com/js/api.js",
	recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
	recaptchaEnterpriseScript: "https://www.google.com/recaptcha/enterprise.js?render="
}), Oo("Browser");
//#endregion
//#region node_modules/@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js
var Po = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Fo = {}, Io;
(function() {
	var e;
	function t(e, t) {
		function n() {}
		n.prototype = t.prototype, e.F = t.prototype, e.prototype = new n(), e.prototype.constructor = e, e.D = function(e, n, r) {
			for (var i = Array(arguments.length - 2), a = 2; a < arguments.length; a++) i[a - 2] = arguments[a];
			return t.prototype[n].apply(e, i);
		};
	}
	function n() {
		this.blockSize = -1;
	}
	function r() {
		this.blockSize = -1, this.blockSize = 64, this.g = [
			,
			,
			,
			,
		], this.C = Array(this.blockSize), this.o = this.h = 0, this.u();
	}
	t(r, n), r.prototype.u = function() {
		this.g[0] = 1732584193, this.g[1] = 4023233417, this.g[2] = 2562383102, this.g[3] = 271733878, this.o = this.h = 0;
	};
	function i(e, t, n) {
		n ||= 0;
		let r = Array(16);
		if (typeof t == "string") for (var i = 0; i < 16; ++i) r[i] = t.charCodeAt(n++) | t.charCodeAt(n++) << 8 | t.charCodeAt(n++) << 16 | t.charCodeAt(n++) << 24;
		else for (i = 0; i < 16; ++i) r[i] = t[n++] | t[n++] << 8 | t[n++] << 16 | t[n++] << 24;
		t = e.g[0], n = e.g[1], i = e.g[2];
		let a = e.g[3], o;
		o = t + (a ^ n & (i ^ a)) + r[0] + 3614090360 & 4294967295, t = n + (o << 7 & 4294967295 | o >>> 25), o = a + (i ^ t & (n ^ i)) + r[1] + 3905402710 & 4294967295, a = t + (o << 12 & 4294967295 | o >>> 20), o = i + (n ^ a & (t ^ n)) + r[2] + 606105819 & 4294967295, i = a + (o << 17 & 4294967295 | o >>> 15), o = n + (t ^ i & (a ^ t)) + r[3] + 3250441966 & 4294967295, n = i + (o << 22 & 4294967295 | o >>> 10), o = t + (a ^ n & (i ^ a)) + r[4] + 4118548399 & 4294967295, t = n + (o << 7 & 4294967295 | o >>> 25), o = a + (i ^ t & (n ^ i)) + r[5] + 1200080426 & 4294967295, a = t + (o << 12 & 4294967295 | o >>> 20), o = i + (n ^ a & (t ^ n)) + r[6] + 2821735955 & 4294967295, i = a + (o << 17 & 4294967295 | o >>> 15), o = n + (t ^ i & (a ^ t)) + r[7] + 4249261313 & 4294967295, n = i + (o << 22 & 4294967295 | o >>> 10), o = t + (a ^ n & (i ^ a)) + r[8] + 1770035416 & 4294967295, t = n + (o << 7 & 4294967295 | o >>> 25), o = a + (i ^ t & (n ^ i)) + r[9] + 2336552879 & 4294967295, a = t + (o << 12 & 4294967295 | o >>> 20), o = i + (n ^ a & (t ^ n)) + r[10] + 4294925233 & 4294967295, i = a + (o << 17 & 4294967295 | o >>> 15), o = n + (t ^ i & (a ^ t)) + r[11] + 2304563134 & 4294967295, n = i + (o << 22 & 4294967295 | o >>> 10), o = t + (a ^ n & (i ^ a)) + r[12] + 1804603682 & 4294967295, t = n + (o << 7 & 4294967295 | o >>> 25), o = a + (i ^ t & (n ^ i)) + r[13] + 4254626195 & 4294967295, a = t + (o << 12 & 4294967295 | o >>> 20), o = i + (n ^ a & (t ^ n)) + r[14] + 2792965006 & 4294967295, i = a + (o << 17 & 4294967295 | o >>> 15), o = n + (t ^ i & (a ^ t)) + r[15] + 1236535329 & 4294967295, n = i + (o << 22 & 4294967295 | o >>> 10), o = t + (i ^ a & (n ^ i)) + r[1] + 4129170786 & 4294967295, t = n + (o << 5 & 4294967295 | o >>> 27), o = a + (n ^ i & (t ^ n)) + r[6] + 3225465664 & 4294967295, a = t + (o << 9 & 4294967295 | o >>> 23), o = i + (t ^ n & (a ^ t)) + r[11] + 643717713 & 4294967295, i = a + (o << 14 & 4294967295 | o >>> 18), o = n + (a ^ t & (i ^ a)) + r[0] + 3921069994 & 4294967295, n = i + (o << 20 & 4294967295 | o >>> 12), o = t + (i ^ a & (n ^ i)) + r[5] + 3593408605 & 4294967295, t = n + (o << 5 & 4294967295 | o >>> 27), o = a + (n ^ i & (t ^ n)) + r[10] + 38016083 & 4294967295, a = t + (o << 9 & 4294967295 | o >>> 23), o = i + (t ^ n & (a ^ t)) + r[15] + 3634488961 & 4294967295, i = a + (o << 14 & 4294967295 | o >>> 18), o = n + (a ^ t & (i ^ a)) + r[4] + 3889429448 & 4294967295, n = i + (o << 20 & 4294967295 | o >>> 12), o = t + (i ^ a & (n ^ i)) + r[9] + 568446438 & 4294967295, t = n + (o << 5 & 4294967295 | o >>> 27), o = a + (n ^ i & (t ^ n)) + r[14] + 3275163606 & 4294967295, a = t + (o << 9 & 4294967295 | o >>> 23), o = i + (t ^ n & (a ^ t)) + r[3] + 4107603335 & 4294967295, i = a + (o << 14 & 4294967295 | o >>> 18), o = n + (a ^ t & (i ^ a)) + r[8] + 1163531501 & 4294967295, n = i + (o << 20 & 4294967295 | o >>> 12), o = t + (i ^ a & (n ^ i)) + r[13] + 2850285829 & 4294967295, t = n + (o << 5 & 4294967295 | o >>> 27), o = a + (n ^ i & (t ^ n)) + r[2] + 4243563512 & 4294967295, a = t + (o << 9 & 4294967295 | o >>> 23), o = i + (t ^ n & (a ^ t)) + r[7] + 1735328473 & 4294967295, i = a + (o << 14 & 4294967295 | o >>> 18), o = n + (a ^ t & (i ^ a)) + r[12] + 2368359562 & 4294967295, n = i + (o << 20 & 4294967295 | o >>> 12), o = t + (n ^ i ^ a) + r[5] + 4294588738 & 4294967295, t = n + (o << 4 & 4294967295 | o >>> 28), o = a + (t ^ n ^ i) + r[8] + 2272392833 & 4294967295, a = t + (o << 11 & 4294967295 | o >>> 21), o = i + (a ^ t ^ n) + r[11] + 1839030562 & 4294967295, i = a + (o << 16 & 4294967295 | o >>> 16), o = n + (i ^ a ^ t) + r[14] + 4259657740 & 4294967295, n = i + (o << 23 & 4294967295 | o >>> 9), o = t + (n ^ i ^ a) + r[1] + 2763975236 & 4294967295, t = n + (o << 4 & 4294967295 | o >>> 28), o = a + (t ^ n ^ i) + r[4] + 1272893353 & 4294967295, a = t + (o << 11 & 4294967295 | o >>> 21), o = i + (a ^ t ^ n) + r[7] + 4139469664 & 4294967295, i = a + (o << 16 & 4294967295 | o >>> 16), o = n + (i ^ a ^ t) + r[10] + 3200236656 & 4294967295, n = i + (o << 23 & 4294967295 | o >>> 9), o = t + (n ^ i ^ a) + r[13] + 681279174 & 4294967295, t = n + (o << 4 & 4294967295 | o >>> 28), o = a + (t ^ n ^ i) + r[0] + 3936430074 & 4294967295, a = t + (o << 11 & 4294967295 | o >>> 21), o = i + (a ^ t ^ n) + r[3] + 3572445317 & 4294967295, i = a + (o << 16 & 4294967295 | o >>> 16), o = n + (i ^ a ^ t) + r[6] + 76029189 & 4294967295, n = i + (o << 23 & 4294967295 | o >>> 9), o = t + (n ^ i ^ a) + r[9] + 3654602809 & 4294967295, t = n + (o << 4 & 4294967295 | o >>> 28), o = a + (t ^ n ^ i) + r[12] + 3873151461 & 4294967295, a = t + (o << 11 & 4294967295 | o >>> 21), o = i + (a ^ t ^ n) + r[15] + 530742520 & 4294967295, i = a + (o << 16 & 4294967295 | o >>> 16), o = n + (i ^ a ^ t) + r[2] + 3299628645 & 4294967295, n = i + (o << 23 & 4294967295 | o >>> 9), o = t + (i ^ (n | ~a)) + r[0] + 4096336452 & 4294967295, t = n + (o << 6 & 4294967295 | o >>> 26), o = a + (n ^ (t | ~i)) + r[7] + 1126891415 & 4294967295, a = t + (o << 10 & 4294967295 | o >>> 22), o = i + (t ^ (a | ~n)) + r[14] + 2878612391 & 4294967295, i = a + (o << 15 & 4294967295 | o >>> 17), o = n + (a ^ (i | ~t)) + r[5] + 4237533241 & 4294967295, n = i + (o << 21 & 4294967295 | o >>> 11), o = t + (i ^ (n | ~a)) + r[12] + 1700485571 & 4294967295, t = n + (o << 6 & 4294967295 | o >>> 26), o = a + (n ^ (t | ~i)) + r[3] + 2399980690 & 4294967295, a = t + (o << 10 & 4294967295 | o >>> 22), o = i + (t ^ (a | ~n)) + r[10] + 4293915773 & 4294967295, i = a + (o << 15 & 4294967295 | o >>> 17), o = n + (a ^ (i | ~t)) + r[1] + 2240044497 & 4294967295, n = i + (o << 21 & 4294967295 | o >>> 11), o = t + (i ^ (n | ~a)) + r[8] + 1873313359 & 4294967295, t = n + (o << 6 & 4294967295 | o >>> 26), o = a + (n ^ (t | ~i)) + r[15] + 4264355552 & 4294967295, a = t + (o << 10 & 4294967295 | o >>> 22), o = i + (t ^ (a | ~n)) + r[6] + 2734768916 & 4294967295, i = a + (o << 15 & 4294967295 | o >>> 17), o = n + (a ^ (i | ~t)) + r[13] + 1309151649 & 4294967295, n = i + (o << 21 & 4294967295 | o >>> 11), o = t + (i ^ (n | ~a)) + r[4] + 4149444226 & 4294967295, t = n + (o << 6 & 4294967295 | o >>> 26), o = a + (n ^ (t | ~i)) + r[11] + 3174756917 & 4294967295, a = t + (o << 10 & 4294967295 | o >>> 22), o = i + (t ^ (a | ~n)) + r[2] + 718787259 & 4294967295, i = a + (o << 15 & 4294967295 | o >>> 17), o = n + (a ^ (i | ~t)) + r[9] + 3951481745 & 4294967295, e.g[0] = e.g[0] + t & 4294967295, e.g[1] = e.g[1] + (i + (o << 21 & 4294967295 | o >>> 11)) & 4294967295, e.g[2] = e.g[2] + i & 4294967295, e.g[3] = e.g[3] + a & 4294967295;
	}
	r.prototype.v = function(e, t) {
		t === void 0 && (t = e.length);
		let n = t - this.blockSize, r = this.C, a = this.h, o = 0;
		for (; o < t;) {
			if (a == 0) for (; o <= n;) i(this, e, o), o += this.blockSize;
			if (typeof e == "string") {
				for (; o < t;) if (r[a++] = e.charCodeAt(o++), a == this.blockSize) {
					i(this, r), a = 0;
					break;
				}
			} else for (; o < t;) if (r[a++] = e[o++], a == this.blockSize) {
				i(this, r), a = 0;
				break;
			}
		}
		this.h = a, this.o += t;
	}, r.prototype.A = function() {
		var e = Array((this.h < 56 ? this.blockSize : this.blockSize * 2) - this.h);
		e[0] = 128;
		for (var t = 1; t < e.length - 8; ++t) e[t] = 0;
		t = this.o * 8;
		for (var n = e.length - 8; n < e.length; ++n) e[n] = t & 255, t /= 256;
		for (this.v(e), e = Array(16), t = 0, n = 0; n < 4; ++n) for (let r = 0; r < 32; r += 8) e[t++] = this.g[n] >>> r & 255;
		return e;
	};
	function a(e, t) {
		var n = s;
		return Object.prototype.hasOwnProperty.call(n, e) ? n[e] : n[e] = t(e);
	}
	function o(e, t) {
		this.h = t;
		let n = [], r = !0;
		for (let i = e.length - 1; i >= 0; i--) {
			let a = e[i] | 0;
			r && a == t || (n[i] = a, r = !1);
		}
		this.g = n;
	}
	var s = {};
	function c(e) {
		return -128 <= e && e < 128 ? a(e, function(e) {
			return new o([e | 0], e < 0 ? -1 : 0);
		}) : new o([e | 0], e < 0 ? -1 : 0);
	}
	function l(e) {
		if (isNaN(e) || !isFinite(e)) return d;
		if (e < 0) return g(l(-e));
		let t = [], n = 1;
		for (let r = 0; e >= n; r++) t[r] = e / n | 0, n *= 4294967296;
		return new o(t, 0);
	}
	function u(e, t) {
		if (e.length == 0) throw Error("number format error: empty string");
		if (t ||= 10, t < 2 || 36 < t) throw Error("radix out of range: " + t);
		if (e.charAt(0) == "-") return g(u(e.substring(1), t));
		if (e.indexOf("-") >= 0) throw Error("number format error: interior \"-\" character");
		let n = l(t ** 8), r = d;
		for (let a = 0; a < e.length; a += 8) {
			var i = Math.min(8, e.length - a);
			let o = parseInt(e.substring(a, a + i), t);
			i < 8 ? (i = l(t ** +i), r = r.j(i).add(l(o))) : (r = r.j(n), r = r.add(l(o)));
		}
		return r;
	}
	var d = c(0), f = c(1), p = c(16777216);
	e = o.prototype, e.m = function() {
		if (h(this)) return -g(this).m();
		let e = 0, t = 1;
		for (let n = 0; n < this.g.length; n++) {
			let r = this.i(n);
			e += (r >= 0 ? r : 4294967296 + r) * t, t *= 4294967296;
		}
		return e;
	}, e.toString = function(e) {
		if (e ||= 10, e < 2 || 36 < e) throw Error("radix out of range: " + e);
		if (m(this)) return "0";
		if (h(this)) return "-" + g(this).toString(e);
		let t = l(e ** 6);
		var n = this;
		let r = "";
		for (;;) {
			let i = te(n, t).g;
			n = _(n, i.j(t));
			let a = ((n.g.length > 0 ? n.g[0] : n.h) >>> 0).toString(e);
			if (n = i, m(n)) return a + r;
			for (; a.length < 6;) a = "0" + a;
			r = a + r;
		}
	}, e.i = function(e) {
		return e < 0 ? 0 : e < this.g.length ? this.g[e] : this.h;
	};
	function m(e) {
		if (e.h != 0) return !1;
		for (let t = 0; t < e.g.length; t++) if (e.g[t] != 0) return !1;
		return !0;
	}
	function h(e) {
		return e.h == -1;
	}
	e.l = function(e) {
		return e = _(this, e), h(e) ? -1 : +!m(e);
	};
	function g(e) {
		let t = e.g.length, n = [];
		for (let r = 0; r < t; r++) n[r] = ~e.g[r];
		return new o(n, ~e.h).add(f);
	}
	e.abs = function() {
		return h(this) ? g(this) : this;
	}, e.add = function(e) {
		let t = Math.max(this.g.length, e.g.length), n = [], r = 0;
		for (let i = 0; i <= t; i++) {
			let t = r + (this.i(i) & 65535) + (e.i(i) & 65535), a = (t >>> 16) + (this.i(i) >>> 16) + (e.i(i) >>> 16);
			r = a >>> 16, t &= 65535, a &= 65535, n[i] = a << 16 | t;
		}
		return new o(n, n[n.length - 1] & -2147483648 ? -1 : 0);
	};
	function _(e, t) {
		return e.add(g(t));
	}
	e.j = function(e) {
		if (m(this) || m(e)) return d;
		if (h(this)) return h(e) ? g(this).j(g(e)) : g(g(this).j(e));
		if (h(e)) return g(this.j(g(e)));
		if (this.l(p) < 0 && e.l(p) < 0) return l(this.m() * e.m());
		let t = this.g.length + e.g.length, n = [];
		for (var r = 0; r < 2 * t; r++) n[r] = 0;
		for (r = 0; r < this.g.length; r++) for (let t = 0; t < e.g.length; t++) {
			let i = this.i(r) >>> 16, a = this.i(r) & 65535, o = e.i(t) >>> 16, s = e.i(t) & 65535;
			n[2 * r + 2 * t] += a * s, ee(n, 2 * r + 2 * t), n[2 * r + 2 * t + 1] += i * s, ee(n, 2 * r + 2 * t + 1), n[2 * r + 2 * t + 1] += a * o, ee(n, 2 * r + 2 * t + 1), n[2 * r + 2 * t + 2] += i * o, ee(n, 2 * r + 2 * t + 2);
		}
		for (e = 0; e < t; e++) n[e] = n[2 * e + 1] << 16 | n[2 * e];
		for (e = t; e < 2 * t; e++) n[e] = 0;
		return new o(n, 0);
	};
	function ee(e, t) {
		for (; (e[t] & 65535) != e[t];) e[t + 1] += e[t] >>> 16, e[t] &= 65535, t++;
	}
	function v(e, t) {
		this.g = e, this.h = t;
	}
	function te(e, t) {
		if (m(t)) throw Error("division by zero");
		if (m(e)) return new v(d, d);
		if (h(e)) return t = te(g(e), t), new v(g(t.g), g(t.h));
		if (h(t)) return t = te(e, g(t)), new v(g(t.g), t.h);
		if (e.g.length > 30) {
			if (h(e) || h(t)) throw Error("slowDivide_ only works with positive integers.");
			for (var n = f, r = t; r.l(e) <= 0;) n = ne(n), r = ne(r);
			var i = re(n, 1), a = re(r, 1);
			for (r = re(r, 2), n = re(n, 2); !m(r);) {
				var o = a.add(r);
				o.l(e) <= 0 && (i = i.add(n), a = o), r = re(r, 1), n = re(n, 1);
			}
			return t = _(e, i.j(t)), new v(i, t);
		}
		for (i = d; e.l(t) >= 0;) {
			for (n = Math.max(1, Math.floor(e.m() / t.m())), r = Math.ceil(Math.log(n) / Math.LN2), r = r <= 48 ? 1 : 2 ** (r - 48), a = l(n), o = a.j(t); h(o) || o.l(e) > 0;) n -= r, a = l(n), o = a.j(t);
			m(a) && (a = f), i = i.add(a), e = _(e, o);
		}
		return new v(i, e);
	}
	e.B = function(e) {
		return te(this, e).h;
	}, e.and = function(e) {
		let t = Math.max(this.g.length, e.g.length), n = [];
		for (let r = 0; r < t; r++) n[r] = this.i(r) & e.i(r);
		return new o(n, this.h & e.h);
	}, e.or = function(e) {
		let t = Math.max(this.g.length, e.g.length), n = [];
		for (let r = 0; r < t; r++) n[r] = this.i(r) | e.i(r);
		return new o(n, this.h | e.h);
	}, e.xor = function(e) {
		let t = Math.max(this.g.length, e.g.length), n = [];
		for (let r = 0; r < t; r++) n[r] = this.i(r) ^ e.i(r);
		return new o(n, this.h ^ e.h);
	};
	function ne(e) {
		let t = e.g.length + 1, n = [];
		for (let r = 0; r < t; r++) n[r] = e.i(r) << 1 | e.i(r - 1) >>> 31;
		return new o(n, e.h);
	}
	function re(e, t) {
		let n = t >> 5;
		t %= 32;
		let r = e.g.length - n, i = [];
		for (let a = 0; a < r; a++) i[a] = t > 0 ? e.i(a + n) >>> t | e.i(a + n + 1) << 32 - t : e.i(a + n);
		return new o(i, e.h);
	}
	r.prototype.digest = r.prototype.A, r.prototype.reset = r.prototype.u, r.prototype.update = r.prototype.v, o.prototype.add = o.prototype.add, o.prototype.multiply = o.prototype.j, o.prototype.modulo = o.prototype.B, o.prototype.compare = o.prototype.l, o.prototype.toNumber = o.prototype.m, o.prototype.toString = o.prototype.toString, o.prototype.getBits = o.prototype.i, o.fromNumber = l, o.fromString = u, Io = Fo.Integer = o;
}).apply(Po === void 0 ? typeof self < "u" ? self : typeof window < "u" ? window : {} : Po);
//#endregion
//#region node_modules/@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js
var Lo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ro = {}, zo, Bo, Vo, Ho, Uo, Wo, Go, Ko;
(function() {
	var e, t = Object.defineProperty;
	function n(e) {
		e = [
			typeof globalThis == "object" && globalThis,
			e,
			typeof window == "object" && window,
			typeof self == "object" && self,
			typeof Lo == "object" && Lo
		];
		for (var t = 0; t < e.length; ++t) {
			var n = e[t];
			if (n && n.Math == Math) return n;
		}
		throw Error("Cannot find global object");
	}
	var r = n(this);
	function i(e, n) {
		if (n) a: {
			var i = r;
			e = e.split(".");
			for (var a = 0; a < e.length - 1; a++) {
				var o = e[a];
				if (!(o in i)) break a;
				i = i[o];
			}
			e = e[e.length - 1], a = i[e], n = n(a), n != a && n != null && t(i, e, {
				configurable: !0,
				writable: !0,
				value: n
			});
		}
	}
	i("Symbol.dispose", function(e) {
		return e || Symbol("Symbol.dispose");
	}), i("Array.prototype.values", function(e) {
		return e || function() {
			return this[Symbol.iterator]();
		};
	}), i("Object.entries", function(e) {
		return e || function(e) {
			var t = [], n;
			for (n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push([n, e[n]]);
			return t;
		};
	});
	var a = a || {}, o = this || self;
	function s(e) {
		var t = typeof e;
		return t == "object" && e != null || t == "function";
	}
	function c(e, t, n) {
		return e.call.apply(e.bind, arguments);
	}
	function l(e, t, n) {
		return l = c, l.apply(null, arguments);
	}
	function u(e, t) {
		var n = Array.prototype.slice.call(arguments, 1);
		return function() {
			var t = n.slice();
			return t.push.apply(t, arguments), e.apply(this, t);
		};
	}
	function d(e, t) {
		function n() {}
		n.prototype = t.prototype, e.Z = t.prototype, e.prototype = new n(), e.prototype.constructor = e, e.Ob = function(e, n, r) {
			for (var i = Array(arguments.length - 2), a = 2; a < arguments.length; a++) i[a - 2] = arguments[a];
			return t.prototype[n].apply(e, i);
		};
	}
	var f = typeof AsyncContext < "u" && typeof AsyncContext.Snapshot == "function" ? (e) => e && AsyncContext.Snapshot.wrap(e) : (e) => e;
	function p(e) {
		let t = e.length;
		if (t > 0) {
			let n = Array(t);
			for (let r = 0; r < t; r++) n[r] = e[r];
			return n;
		}
		return [];
	}
	function m(e, t) {
		for (let t = 1; t < arguments.length; t++) {
			let r = arguments[t];
			var n = typeof r;
			if (n = n == "object" ? r ? Array.isArray(r) ? "array" : n : "null" : n, n == "array" || n == "object" && typeof r.length == "number") {
				n = e.length || 0;
				let t = r.length || 0;
				e.length = n + t;
				for (let i = 0; i < t; i++) e[n + i] = r[i];
			} else e.push(r);
		}
	}
	class h {
		constructor(e, t) {
			this.i = e, this.j = t, this.h = 0, this.g = null;
		}
		get() {
			let e;
			return this.h > 0 ? (this.h--, e = this.g, this.g = e.next, e.next = null) : e = this.i(), e;
		}
	}
	function g(e) {
		o.setTimeout(() => {
			throw e;
		}, 0);
	}
	function _() {
		var e = ie;
		let t = null;
		return e.g && (t = e.g, e.g = e.g.next, e.g || (e.h = null), t.next = null), t;
	}
	class ee {
		constructor() {
			this.h = this.g = null;
		}
		add(e, t) {
			let n = v.get();
			n.set(e, t), this.h ? this.h.next = n : this.g = n, this.h = n;
		}
	}
	var v = new h(() => new te(), (e) => e.reset());
	class te {
		constructor() {
			this.next = this.g = this.h = null;
		}
		set(e, t) {
			this.h = e, this.g = t, this.next = null;
		}
		reset() {
			this.next = this.g = this.h = null;
		}
	}
	let ne, re = !1, ie = new ee(), ae = () => {
		let e = Promise.resolve(void 0);
		ne = () => {
			e.then(oe);
		};
	};
	function oe() {
		for (var e; e = _();) {
			try {
				e.h.call(e.g);
			} catch (e) {
				g(e);
			}
			var t = v;
			t.j(e), t.h < 100 && (t.h++, e.next = t.g, t.g = e);
		}
		re = !1;
	}
	function se() {
		this.u = this.u, this.C = this.C;
	}
	se.prototype.u = !1, se.prototype.dispose = function() {
		this.u || (this.u = !0, this.N());
	}, se.prototype[Symbol.dispose] = function() {
		this.dispose();
	}, se.prototype.N = function() {
		if (this.C) for (; this.C.length;) this.C.shift()();
	};
	function ce(e, t) {
		this.type = e, this.g = this.target = t, this.defaultPrevented = !1;
	}
	ce.prototype.h = function() {
		this.defaultPrevented = !0;
	};
	var le = function() {
		if (!o.addEventListener || !Object.defineProperty) return !1;
		var e = !1, t = Object.defineProperty({}, "passive", { get: function() {
			e = !0;
		} });
		try {
			let e = () => {};
			o.addEventListener("test", e, t), o.removeEventListener("test", e, t);
		} catch {}
		return e;
	}();
	function ue(e) {
		return /^[\s\xa0]*$/.test(e);
	}
	function de(e, t) {
		ce.call(this, e ? e.type : ""), this.relatedTarget = this.g = this.target = null, this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0, this.key = "", this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1, this.state = null, this.pointerId = 0, this.pointerType = "", this.i = null, e && this.init(e, t);
	}
	d(de, ce), de.prototype.init = function(e, t) {
		let n = this.type = e.type, r = e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : null;
		this.target = e.target || e.srcElement, this.g = t, t = e.relatedTarget, t || (n == "mouseover" ? t = e.fromElement : n == "mouseout" && (t = e.toElement)), this.relatedTarget = t, r ? (this.clientX = r.clientX === void 0 ? r.pageX : r.clientX, this.clientY = r.clientY === void 0 ? r.pageY : r.clientY, this.screenX = r.screenX || 0, this.screenY = r.screenY || 0) : (this.clientX = e.clientX === void 0 ? e.pageX : e.clientX, this.clientY = e.clientY === void 0 ? e.pageY : e.clientY, this.screenX = e.screenX || 0, this.screenY = e.screenY || 0), this.button = e.button, this.key = e.key || "", this.ctrlKey = e.ctrlKey, this.altKey = e.altKey, this.shiftKey = e.shiftKey, this.metaKey = e.metaKey, this.pointerId = e.pointerId || 0, this.pointerType = e.pointerType, this.state = e.state, this.i = e, e.defaultPrevented && de.Z.h.call(this);
	}, de.prototype.h = function() {
		de.Z.h.call(this);
		let e = this.i;
		e.preventDefault ? e.preventDefault() : e.returnValue = !1;
	};
	var fe = "closure_listenable_" + (Math.random() * 1e6 | 0), pe = 0;
	function me(e, t, n, r, i) {
		this.listener = e, this.proxy = null, this.src = t, this.type = n, this.capture = !!r, this.ha = i, this.key = ++pe, this.da = this.fa = !1;
	}
	function he(e) {
		e.da = !0, e.listener = null, e.proxy = null, e.src = null, e.ha = null;
	}
	function ge(e, t, n) {
		for (let r in e) t.call(n, e[r], r, e);
	}
	function _e(e, t) {
		for (let n in e) t.call(void 0, e[n], n, e);
	}
	function ve(e) {
		let t = {};
		for (let n in e) t[n] = e[n];
		return t;
	}
	let ye = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
	function be(e, t) {
		let n, r;
		for (let t = 1; t < arguments.length; t++) {
			for (n in r = arguments[t], r) e[n] = r[n];
			for (let t = 0; t < ye.length; t++) n = ye[t], Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
		}
	}
	function xe(e) {
		this.src = e, this.g = {}, this.h = 0;
	}
	xe.prototype.add = function(e, t, n, r, i) {
		let a = e.toString();
		e = this.g[a], e || (e = this.g[a] = [], this.h++);
		let o = Ce(e, t, r, i);
		return o > -1 ? (t = e[o], n || (t.fa = !1)) : (t = new me(t, this.src, a, !!r, i), t.fa = n, e.push(t)), t;
	};
	function Se(e, t) {
		let n = t.type;
		if (n in e.g) {
			var r = e.g[n], i = Array.prototype.indexOf.call(r, t, void 0), a;
			(a = i >= 0) && Array.prototype.splice.call(r, i, 1), a && (he(t), e.g[n].length == 0 && (delete e.g[n], e.h--));
		}
	}
	function Ce(e, t, n, r) {
		for (let i = 0; i < e.length; ++i) {
			let a = e[i];
			if (!a.da && a.listener == t && a.capture == !!n && a.ha == r) return i;
		}
		return -1;
	}
	var we = "closure_lm_" + (Math.random() * 1e6 | 0), Te = {};
	function Ee(e, t, n, r, i) {
		if (Array.isArray(t)) {
			for (let a = 0; a < t.length; a++) Ee(e, t[a], n, r, i);
			return null;
		}
		return n = Pe(n), e && e[fe] ? e.J(t, n, s(r) ? !!r.capture : !1, i) : De(e, t, n, !1, r, i);
	}
	function De(e, t, n, r, i, a) {
		if (!t) throw Error("Invalid event type");
		let o = s(i) ? !!i.capture : !!i, c = Ne(e);
		if (c || (e[we] = c = new xe(e)), n = c.add(t, n, r, o, a), n.proxy) return n;
		if (r = Oe(), n.proxy = r, r.src = e, r.listener = n, e.addEventListener) le || (i = o), i === void 0 && (i = !1), e.addEventListener(t.toString(), r, i);
		else if (e.attachEvent) e.attachEvent(je(t.toString()), r);
		else if (e.addListener && e.removeListener) e.addListener(r);
		else throw Error("addEventListener and attachEvent are unavailable.");
		return n;
	}
	function Oe() {
		function e(n) {
			return t.call(e.src, e.listener, n);
		}
		let t = Me;
		return e;
	}
	function ke(e, t, n, r, i) {
		if (Array.isArray(t)) for (var a = 0; a < t.length; a++) ke(e, t[a], n, r, i);
		else r = s(r) ? !!r.capture : !!r, n = Pe(n), e && e[fe] ? (e = e.i, a = String(t).toString(), a in e.g && (t = e.g[a], n = Ce(t, n, r, i), n > -1 && (he(t[n]), Array.prototype.splice.call(t, n, 1), t.length == 0 && (delete e.g[a], e.h--)))) : (e &&= Ne(e)) && (t = e.g[t.toString()], e = -1, t && (e = Ce(t, n, r, i)), (n = e > -1 ? t[e] : null) && Ae(n));
	}
	function Ae(e) {
		if (typeof e != "number" && e && !e.da) {
			var t = e.src;
			if (t && t[fe]) Se(t.i, e);
			else {
				var n = e.type, r = e.proxy;
				t.removeEventListener ? t.removeEventListener(n, r, e.capture) : t.detachEvent ? t.detachEvent(je(n), r) : t.addListener && t.removeListener && t.removeListener(r), (n = Ne(t)) ? (Se(n, e), n.h == 0 && (n.src = null, t[we] = null)) : he(e);
			}
		}
	}
	function je(e) {
		return e in Te ? Te[e] : Te[e] = "on" + e;
	}
	function Me(e, t) {
		if (e.da) e = !0;
		else {
			t = new de(t, this);
			let n = e.listener, r = e.ha || e.src;
			e.fa && Ae(e), e = n.call(r, t);
		}
		return e;
	}
	function Ne(e) {
		return e = e[we], e instanceof xe ? e : null;
	}
	var y = "__closure_events_fn_" + (Math.random() * 1e9 >>> 0);
	function Pe(e) {
		return typeof e == "function" ? e : (e[y] || (e[y] = function(t) {
			return e.handleEvent(t);
		}), e[y]);
	}
	function Fe() {
		se.call(this), this.i = new xe(this), this.M = this, this.G = null;
	}
	d(Fe, se), Fe.prototype[fe] = !0, Fe.prototype.removeEventListener = function(e, t, n, r) {
		ke(this, e, t, n, r);
	};
	function Ie(e, t) {
		var n, r = e.G;
		if (r) for (n = []; r; r = r.G) n.push(r);
		if (e = e.M, r = t.type || t, typeof t == "string") t = new ce(t, e);
		else if (t instanceof ce) t.target = t.target || e;
		else {
			var i = t;
			t = new ce(r, e), be(t, i);
		}
		i = !0;
		let a, o;
		if (n) for (o = n.length - 1; o >= 0; o--) a = t.g = n[o], i = Le(a, r, !0, t) && i;
		if (a = t.g = e, i = Le(a, r, !0, t) && i, i = Le(a, r, !1, t) && i, n) for (o = 0; o < n.length; o++) a = t.g = n[o], i = Le(a, r, !1, t) && i;
	}
	Fe.prototype.N = function() {
		if (Fe.Z.N.call(this), this.i) {
			var e = this.i;
			for (let t in e.g) {
				let n = e.g[t];
				for (let e = 0; e < n.length; e++) he(n[e]);
				delete e.g[t], e.h--;
			}
		}
		this.G = null;
	}, Fe.prototype.J = function(e, t, n, r) {
		return this.i.add(String(e), t, !1, n, r);
	}, Fe.prototype.K = function(e, t, n, r) {
		return this.i.add(String(e), t, !0, n, r);
	};
	function Le(e, t, n, r) {
		if (t = e.i.g[String(t)], !t) return !0;
		t = t.concat();
		let i = !0;
		for (let a = 0; a < t.length; ++a) {
			let o = t[a];
			if (o && !o.da && o.capture == n) {
				let t = o.listener, n = o.ha || o.src;
				o.fa && Se(e.i, o), i = t.call(n, r) !== !1 && i;
			}
		}
		return i && !r.defaultPrevented;
	}
	function Re(e, t) {
		if (typeof e != "function") {
			if (e && typeof e.handleEvent == "function") e = l(e.handleEvent, e);
			else throw Error("Invalid listener argument");
		}
		return Number(t) > 2147483647 ? -1 : o.setTimeout(e, t || 0);
	}
	function ze(e) {
		e.g = Re(() => {
			e.g = null, e.i && (e.i = !1, ze(e));
		}, e.l);
		let t = e.h;
		e.h = null, e.m.apply(null, t);
	}
	class Be extends se {
		constructor(e, t) {
			super(), this.m = e, this.l = t, this.h = null, this.i = !1, this.g = null;
		}
		j(e) {
			this.h = arguments, this.g ? this.i = !0 : ze(this);
		}
		N() {
			super.N(), this.g && (o.clearTimeout(this.g), this.g = null, this.i = !1, this.h = null);
		}
	}
	function Ve(e) {
		se.call(this), this.h = e, this.g = {};
	}
	d(Ve, se);
	var He = [];
	function Ue(e) {
		ge(e.g, function(e, t) {
			this.g.hasOwnProperty(t) && Ae(e);
		}, e), e.g = {};
	}
	Ve.prototype.N = function() {
		Ve.Z.N.call(this), Ue(this);
	}, Ve.prototype.handleEvent = function() {
		throw Error("EventHandler.handleEvent not implemented");
	};
	var We = o.JSON.stringify, Ge = o.JSON.parse, Ke = class {
		stringify(e) {
			return o.JSON.stringify(e, void 0);
		}
		parse(e) {
			return o.JSON.parse(e, void 0);
		}
	};
	function qe() {}
	function Je() {}
	var Ye = {
		OPEN: "a",
		hb: "b",
		ERROR: "c",
		tb: "d"
	};
	function Xe() {
		ce.call(this, "d");
	}
	d(Xe, ce);
	function Ze() {
		ce.call(this, "c");
	}
	d(Ze, ce);
	var Qe = {}, $e = null;
	function et() {
		return $e ||= new Fe();
	}
	Qe.Ia = "serverreachability";
	function tt(e) {
		ce.call(this, Qe.Ia, e);
	}
	d(tt, ce);
	function nt(e) {
		let t = et();
		Ie(t, new tt(t));
	}
	Qe.STAT_EVENT = "statevent";
	function rt(e, t) {
		ce.call(this, Qe.STAT_EVENT, e), this.stat = t;
	}
	d(rt, ce);
	function it(e) {
		let t = et();
		Ie(t, new rt(t, e));
	}
	Qe.Ja = "timingevent";
	function at(e, t) {
		ce.call(this, Qe.Ja, e), this.size = t;
	}
	d(at, ce);
	function ot(e, t) {
		if (typeof e != "function") throw Error("Fn must not be null and must be a function");
		return o.setTimeout(function() {
			e();
		}, t);
	}
	function st() {
		this.g = !0;
	}
	st.prototype.ua = function() {
		this.g = !1;
	};
	function ct(e, t, n, r, i, a) {
		e.info(function() {
			if (e.g) {
				if (a) {
					var o = "", s = a.split("&");
					for (let e = 0; e < s.length; e++) {
						var c = s[e].split("=");
						if (c.length > 1) {
							let e = c[0];
							c = c[1];
							let t = e.split("_");
							o = t.length >= 2 && t[1] == "type" ? o + (e + "=" + c + "&") : o + (e + "=redacted&");
						}
					}
				} else o = null;
			} else o = a;
			return "XMLHTTP REQ (" + r + ") [attempt " + i + "]: " + t + "\n" + n + "\n" + o;
		});
	}
	function lt(e, t, n, r, i, a, o) {
		e.info(function() {
			return "XMLHTTP RESP (" + r + ") [ attempt " + i + "]: " + t + "\n" + n + "\n" + a + " " + o;
		});
	}
	function ut(e, t, n, r) {
		e.info(function() {
			return "XMLHTTP TEXT (" + t + "): " + ft(e, n) + (r ? " " + r : "");
		});
	}
	function dt(e, t) {
		e.info(function() {
			return "TIMEOUT: " + t;
		});
	}
	st.prototype.info = function() {};
	function ft(e, t) {
		if (!e.g) return t;
		if (!t) return null;
		try {
			let a = JSON.parse(t);
			if (a) {
				for (e = 0; e < a.length; e++) if (Array.isArray(a[e])) {
					var n = a[e];
					if (!(n.length < 2)) {
						var r = n[1];
						if (Array.isArray(r) && !(r.length < 1)) {
							var i = r[0];
							if (i != "noop" && i != "stop" && i != "close") for (let e = 1; e < r.length; e++) r[e] = "";
						}
					}
				}
			}
			return We(a);
		} catch {
			return t;
		}
	}
	var pt = {
		NO_ERROR: 0,
		cb: 1,
		qb: 2,
		pb: 3,
		kb: 4,
		ob: 5,
		rb: 6,
		Ga: 7,
		TIMEOUT: 8,
		ub: 9
	}, mt = {
		ib: "complete",
		Fb: "success",
		ERROR: "error",
		Ga: "abort",
		xb: "ready",
		yb: "readystatechange",
		TIMEOUT: "timeout",
		sb: "incrementaldata",
		wb: "progress",
		lb: "downloadprogress",
		Nb: "uploadprogress"
	}, ht;
	function gt() {}
	d(gt, qe), gt.prototype.g = function() {
		return new XMLHttpRequest();
	}, ht = new gt();
	function _t(e) {
		return encodeURIComponent(String(e));
	}
	function vt(e) {
		var t = 1;
		e = e.split(":");
		let n = [];
		for (; t > 0 && e.length;) n.push(e.shift()), t--;
		return e.length && n.push(e.join(":")), n;
	}
	function yt(e, t, n, r) {
		this.j = e, this.i = t, this.l = n, this.S = r || 1, this.V = new Ve(this), this.H = 45e3, this.J = null, this.o = !1, this.u = this.B = this.A = this.M = this.F = this.T = this.D = null, this.G = [], this.g = null, this.C = 0, this.m = this.v = null, this.X = -1, this.K = !1, this.P = 0, this.O = null, this.W = this.L = this.U = this.R = !1, this.h = new bt();
	}
	function bt() {
		this.i = null, this.g = "", this.h = !1;
	}
	var xt = {}, St = {};
	function Ct(e, t, n) {
		e.M = 1, e.A = Yt(Gt(t)), e.u = n, e.R = !0, wt(e, null);
	}
	function wt(e, t) {
		e.F = Date.now(), Ot(e), e.B = Gt(e.A);
		var n = e.B, r = e.S;
		Array.isArray(r) || (r = [String(r)]), un(n.i, "t", r), e.C = 0, n = e.j.L, e.h = new bt(), e.g = $n(e.j, n ? t : null, !e.u), e.P > 0 && (e.O = new Be(l(e.Y, e, e.g), e.P)), t = e.V, n = e.g, r = e.ba;
		var i = "readystatechange";
		Array.isArray(i) || (i && (He[0] = i.toString()), i = He);
		for (let e = 0; e < i.length; e++) {
			let a = Ee(n, i[e], r || t.handleEvent, !1, t.h || t);
			if (!a) break;
			t.g[a.key] = a;
		}
		t = e.J ? ve(e.J) : {}, e.u ? (e.v ||= "POST", t["Content-Type"] = "application/x-www-form-urlencoded", e.g.ea(e.B, e.v, e.u, t)) : (e.v = "GET", e.g.ea(e.B, e.v, null, t)), nt(), ct(e.i, e.v, e.B, e.l, e.S, e.u);
	}
	yt.prototype.ba = function(e) {
		e = e.target;
		let t = this.O;
		t && An(e) == 3 ? t.j() : this.Y(e);
	}, yt.prototype.Y = function(e) {
		try {
			if (e == this.g) a: {
				let s = An(this.g), c = this.g.ya(), l = this.g.ca();
				if (!(s < 3) && (s != 3 || this.g && (this.h.h || this.g.la() || jn(this.g)))) {
					this.K || s != 4 || c == 7 || nt(c == 8 || l <= 0 ? 3 : 2), At(this);
					var t = this.g.ca();
					this.X = t;
					var n = Tt(this);
					if (this.o = t == 200, lt(this.i, this.v, this.B, this.l, this.S, s, t), this.o) {
						if (this.U && !this.L) {
							b: {
								if (this.g) {
									var r, i = this.g;
									if ((r = i.g ? i.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !ue(r)) {
										var a = r;
										break b;
									}
								}
								a = null;
							}
							if (e = a) ut(this.i, this.l, e, "Initial handshake response via X-HTTP-Initial-Response"), this.L = !0, Nt(this, e);
							else {
								this.o = !1, this.m = 3, it(12), Mt(this), jt(this);
								break a;
							}
						}
						if (this.R) {
							e = !0;
							let t;
							for (; !this.K && this.C < n.length;) if (t = Dt(this, n), t == St) {
								s == 4 && (this.m = 4, it(14), e = !1), ut(this.i, this.l, null, "[Incomplete Response]");
								break;
							} else if (t == xt) {
								this.m = 4, it(15), ut(this.i, this.l, n, "[Invalid Chunk]"), e = !1;
								break;
							} else ut(this.i, this.l, t, null), Nt(this, t);
							if (Et(this) && this.C != 0 && (this.h.g = this.h.g.slice(this.C), this.C = 0), s != 4 || n.length != 0 || this.h.h || (this.m = 1, it(16), e = !1), this.o = this.o && e, !e) ut(this.i, this.l, n, "[Invalid Chunked Response]"), Mt(this), jt(this);
							else if (n.length > 0 && !this.W) {
								this.W = !0;
								var o = this.j;
								o.g == this && o.aa && !o.P && (o.j.info("Great, no buffering proxy detected. Bytes received: " + n.length), Gn(o), o.P = !0, it(11));
							}
						} else ut(this.i, this.l, n, null), Nt(this, n);
						s == 4 && Mt(this), this.o && !this.K && (s == 4 ? Jn(this.j, this) : (this.o = !1, Ot(this)));
					} else Mn(this.g), t == 400 && n.indexOf("Unknown SID") > 0 ? (this.m = 3, it(12)) : (this.m = 0, it(13)), Mt(this), jt(this);
				}
			}
		} catch {}
	};
	function Tt(e) {
		if (!Et(e)) return e.g.la();
		let t = jn(e.g);
		if (t === "") return "";
		let n = "", r = t.length, i = An(e.g) == 4;
		if (!e.h.i) {
			if (typeof TextDecoder > "u") return Mt(e), jt(e), "";
			e.h.i = new o.TextDecoder();
		}
		for (let a = 0; a < r; a++) e.h.h = !0, n += e.h.i.decode(t[a], { stream: !(i && a == r - 1) });
		return t.length = 0, e.h.g += n, e.C = 0, e.h.g;
	}
	function Et(e) {
		return e.g ? e.v == "GET" && e.M != 2 && e.j.Aa : !1;
	}
	function Dt(e, t) {
		var n = e.C, r = t.indexOf("\n", n);
		return r == -1 ? St : (n = Number(t.substring(n, r)), isNaN(n) ? xt : (r += 1, r + n > t.length ? St : (t = t.slice(r, r + n), e.C = r + n, t)));
	}
	yt.prototype.cancel = function() {
		this.K = !0, Mt(this);
	};
	function Ot(e) {
		e.T = Date.now() + e.H, kt(e, e.H);
	}
	function kt(e, t) {
		if (e.D != null) throw Error("WatchDog timer not null");
		e.D = ot(l(e.aa, e), t);
	}
	function At(e) {
		e.D &&= (o.clearTimeout(e.D), null);
	}
	yt.prototype.aa = function() {
		this.D = null;
		let e = Date.now();
		e - this.T >= 0 ? (dt(this.i, this.B), this.M != 2 && (nt(), it(17)), Mt(this), this.m = 2, jt(this)) : kt(this, this.T - e);
	};
	function jt(e) {
		e.j.I == 0 || e.K || Jn(e.j, e);
	}
	function Mt(e) {
		At(e);
		var t = e.O;
		t && typeof t.dispose == "function" && t.dispose(), e.O = null, Ue(e.V), e.g && (t = e.g, e.g = null, t.abort(), t.dispose());
	}
	function Nt(e, t) {
		try {
			var n = e.j;
			if (n.I != 0 && (n.g == e || Rt(n.h, e))) {
				if (!e.L && Rt(n.h, e) && n.I == 3) {
					try {
						var r = n.Ba.g.parse(t);
					} catch {
						r = null;
					}
					if (Array.isArray(r) && r.length == 3) {
						var i = r;
						if (i[0] == 0) {
							a: if (!n.v) {
								if (n.g) {
									if (n.g.F + 3e3 < e.F) qn(n), In(n);
									else break a;
								}
								Wn(n), it(18);
							}
						} else n.xa = i[1], 0 < n.xa - n.K && i[2] < 37500 && n.F && n.A == 0 && !n.C && (n.C = ot(l(n.Va, n), 6e3));
						Lt(n.h) <= 1 && n.ta && (n.ta = void 0);
					} else Xn(n, 11);
				} else if ((e.L || n.g == e) && qn(n), !ue(t)) for (i = n.Ba.g.parse(t), t = 0; t < i.length; t++) {
					let l = i[t], u = l[0];
					if (!(u <= n.K)) {
						if (n.K = u, l = l[1], n.I == 2) {
							if (l[0] == "c") {
								n.M = l[1], n.ba = l[2];
								let t = l[3];
								t != null && (n.ka = t, n.j.info("VER=" + n.ka));
								let i = l[4];
								i != null && (n.za = i, n.j.info("SVER=" + n.za));
								let u = l[5];
								u != null && typeof u == "number" && u > 0 && (r = 1.5 * u, n.O = r, n.j.info("backChannelRequestTimeoutMs_=" + r)), r = n;
								let d = e.g;
								if (d) {
									let e = d.g ? d.g.getResponseHeader("X-Client-Wire-Protocol") : null;
									if (e) {
										var a = r.h;
										a.g || e.indexOf("spdy") == -1 && e.indexOf("quic") == -1 && e.indexOf("h2") == -1 || (a.j = a.l, a.g = /* @__PURE__ */ new Set(), a.h &&= (zt(a, a.h), null));
									}
									if (r.G) {
										let e = d.g ? d.g.getResponseHeader("X-HTTP-Session-Id") : null;
										e && (r.wa = e, b(r.J, r.G, e));
									}
								}
								n.I = 3, n.l && n.l.ra(), n.aa && (n.T = Date.now() - e.F, n.j.info("Handshake RTT: " + n.T + "ms")), r = n;
								var o = e;
								if (r.na = Qn(r, r.L ? r.ba : null, r.W), o.L) {
									Bt(r.h, o);
									var s = o, c = r.O;
									c && (s.H = c), s.D && (At(s), Ot(s)), r.g = o;
								} else Un(r);
								n.i.length > 0 && Rn(n);
							} else l[0] != "stop" && l[0] != "close" || Xn(n, 7);
						} else n.I == 3 && (l[0] == "stop" || l[0] == "close" ? l[0] == "stop" ? Xn(n, 7) : Fn(n) : l[0] != "noop" && n.l && n.l.qa(l), n.A = 0);
					}
				}
			}
			nt(4);
		} catch {}
	}
	var Pt = class {
		constructor(e, t) {
			this.g = e, this.map = t;
		}
	};
	function Ft(e) {
		this.l = e || 10, o.PerformanceNavigationTiming ? (e = o.performance.getEntriesByType("navigation"), e = e.length > 0 && (e[0].nextHopProtocol == "hq" || e[0].nextHopProtocol == "h2")) : e = !!(o.chrome && o.chrome.loadTimes && o.chrome.loadTimes() && o.chrome.loadTimes().wasFetchedViaSpdy), this.j = e ? this.l : 1, this.g = null, this.j > 1 && (this.g = /* @__PURE__ */ new Set()), this.h = null, this.i = [];
	}
	function It(e) {
		return e.h ? !0 : e.g ? e.g.size >= e.j : !1;
	}
	function Lt(e) {
		return e.h ? 1 : e.g ? e.g.size : 0;
	}
	function Rt(e, t) {
		return e.h ? e.h == t : e.g ? e.g.has(t) : !1;
	}
	function zt(e, t) {
		e.g ? e.g.add(t) : e.h = t;
	}
	function Bt(e, t) {
		e.h && e.h == t ? e.h = null : e.g && e.g.has(t) && e.g.delete(t);
	}
	Ft.prototype.cancel = function() {
		if (this.i = Vt(this), this.h) this.h.cancel(), this.h = null;
		else if (this.g && this.g.size !== 0) {
			for (let e of this.g.values()) e.cancel();
			this.g.clear();
		}
	};
	function Vt(e) {
		if (e.h != null) return e.i.concat(e.h.G);
		if (e.g != null && e.g.size !== 0) {
			let t = e.i;
			for (let n of e.g.values()) t = t.concat(n.G);
			return t;
		}
		return p(e.i);
	}
	var Ht = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
	function Ut(e, t) {
		if (e) {
			e = e.split("&");
			for (let n = 0; n < e.length; n++) {
				let r = e[n].indexOf("="), i, a = null;
				r >= 0 ? (i = e[n].substring(0, r), a = e[n].substring(r + 1)) : i = e[n], t(i, a ? decodeURIComponent(a.replace(/\+/g, " ")) : "");
			}
		}
	}
	function Wt(e) {
		this.g = this.o = this.j = "", this.u = null, this.m = this.h = "", this.l = !1;
		let t;
		e instanceof Wt ? (this.l = e.l, Kt(this, e.j), this.o = e.o, this.g = e.g, qt(this, e.u), this.h = e.h, Jt(this, dn(e.i)), this.m = e.m) : e && (t = String(e).match(Ht)) ? (this.l = !1, Kt(this, t[1] || "", !0), this.o = Xt(t[2] || ""), this.g = Xt(t[3] || "", !0), qt(this, t[4]), this.h = Xt(t[5] || "", !0), Jt(this, t[6] || "", !0), this.m = Xt(t[7] || "")) : (this.l = !1, this.i = new an(null, this.l));
	}
	Wt.prototype.toString = function() {
		let e = [];
		var t = this.j;
		t && e.push(Zt(t, $t, !0), ":");
		var n = this.g;
		return (n || t == "file") && (e.push("//"), (t = this.o) && e.push(Zt(t, $t, !0), "@"), e.push(_t(n).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), n = this.u, n != null && e.push(":", String(n))), (n = this.h) && (this.g && n.charAt(0) != "/" && e.push("/"), e.push(Zt(n, n.charAt(0) == "/" ? tn : en, !0))), (n = this.i.toString()) && e.push("?", n), (n = this.m) && e.push("#", Zt(n, rn)), e.join("");
	}, Wt.prototype.resolve = function(e) {
		let t = Gt(this), n = !!e.j;
		n ? Kt(t, e.j) : n = !!e.o, n ? t.o = e.o : n = !!e.g, n ? t.g = e.g : n = e.u != null;
		var r = e.h;
		if (n) qt(t, e.u);
		else if (n = !!e.h) {
			if (r.charAt(0) != "/") {
				if (this.g && !this.h) r = "/" + r;
				else {
					var i = t.h.lastIndexOf("/");
					i != -1 && (r = t.h.slice(0, i + 1) + r);
				}
			}
			if (i = r, i == ".." || i == ".") r = "";
			else if (i.indexOf("./") != -1 || i.indexOf("/.") != -1) {
				r = i.lastIndexOf("/", 0) == 0, i = i.split("/");
				let e = [];
				for (let t = 0; t < i.length;) {
					let n = i[t++];
					n == "." ? r && t == i.length && e.push("") : n == ".." ? ((e.length > 1 || e.length == 1 && e[0] != "") && e.pop(), r && t == i.length && e.push("")) : (e.push(n), r = !0);
				}
				r = e.join("/");
			} else r = i;
		}
		return n ? t.h = r : n = e.i.toString() !== "", n ? Jt(t, dn(e.i)) : n = !!e.m, n && (t.m = e.m), t;
	};
	function Gt(e) {
		return new Wt(e);
	}
	function Kt(e, t, n) {
		e.j = n ? Xt(t, !0) : t, e.j &&= e.j.replace(/:$/, "");
	}
	function qt(e, t) {
		if (t) {
			if (t = Number(t), isNaN(t) || t < 0) throw Error("Bad port number " + t);
			e.u = t;
		} else e.u = null;
	}
	function Jt(e, t, n) {
		t instanceof an ? (e.i = t, pn(e.i, e.l)) : (n || (t = Zt(t, nn)), e.i = new an(t, e.l));
	}
	function b(e, t, n) {
		e.i.set(t, n);
	}
	function Yt(e) {
		return b(e, "zx", Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ Date.now()).toString(36)), e;
	}
	function Xt(e, t) {
		return e ? t ? decodeURI(e.replace(/%25/g, "%2525")) : decodeURIComponent(e) : "";
	}
	function Zt(e, t, n) {
		return typeof e == "string" ? (e = encodeURI(e).replace(t, Qt), n && (e = e.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), e) : null;
	}
	function Qt(e) {
		return e = e.charCodeAt(0), "%" + (e >> 4 & 15).toString(16) + (e & 15).toString(16);
	}
	var $t = /[#\/\?@]/g, en = /[#\?:]/g, tn = /[#\?]/g, nn = /[#\?@]/g, rn = /#/g;
	function an(e, t) {
		this.h = this.g = null, this.i = e || null, this.j = !!t;
	}
	function on(e) {
		e.g || (e.g = /* @__PURE__ */ new Map(), e.h = 0, e.i && Ut(e.i, function(t, n) {
			e.add(decodeURIComponent(t.replace(/\+/g, " ")), n);
		}));
	}
	e = an.prototype, e.add = function(e, t) {
		on(this), this.i = null, e = fn(this, e);
		let n = this.g.get(e);
		return n || this.g.set(e, n = []), n.push(t), this.h += 1, this;
	};
	function sn(e, t) {
		on(e), t = fn(e, t), e.g.has(t) && (e.i = null, e.h -= e.g.get(t).length, e.g.delete(t));
	}
	function cn(e, t) {
		return on(e), t = fn(e, t), e.g.has(t);
	}
	e.forEach = function(e, t) {
		on(this), this.g.forEach(function(n, r) {
			n.forEach(function(n) {
				e.call(t, n, r, this);
			}, this);
		}, this);
	};
	function ln(e, t) {
		on(e);
		let n = [];
		if (typeof t == "string") cn(e, t) && (n = n.concat(e.g.get(fn(e, t))));
		else for (e = Array.from(e.g.values()), t = 0; t < e.length; t++) n = n.concat(e[t]);
		return n;
	}
	e.set = function(e, t) {
		return on(this), this.i = null, e = fn(this, e), cn(this, e) && (this.h -= this.g.get(e).length), this.g.set(e, [t]), this.h += 1, this;
	}, e.get = function(e, t) {
		return e ? (e = ln(this, e), e.length > 0 ? String(e[0]) : t) : t;
	};
	function un(e, t, n) {
		sn(e, t), n.length > 0 && (e.i = null, e.g.set(fn(e, t), p(n)), e.h += n.length);
	}
	e.toString = function() {
		if (this.i) return this.i;
		if (!this.g) return "";
		let e = [], t = Array.from(this.g.keys());
		for (let r = 0; r < t.length; r++) {
			var n = t[r];
			let i = _t(n);
			n = ln(this, n);
			for (let t = 0; t < n.length; t++) {
				let r = i;
				n[t] !== "" && (r += "=" + _t(n[t])), e.push(r);
			}
		}
		return this.i = e.join("&");
	};
	function dn(e) {
		let t = new an();
		return t.i = e.i, e.g && (t.g = new Map(e.g), t.h = e.h), t;
	}
	function fn(e, t) {
		return t = String(t), e.j && (t = t.toLowerCase()), t;
	}
	function pn(e, t) {
		t && !e.j && (on(e), e.i = null, e.g.forEach(function(e, t) {
			let n = t.toLowerCase();
			t != n && (sn(this, t), un(this, n, e));
		}, e)), e.j = t;
	}
	function mn(e, t) {
		let n = new st();
		if (o.Image) {
			let r = new Image();
			r.onload = u(gn, n, "TestLoadImage: loaded", !0, t, r), r.onerror = u(gn, n, "TestLoadImage: error", !1, t, r), r.onabort = u(gn, n, "TestLoadImage: abort", !1, t, r), r.ontimeout = u(gn, n, "TestLoadImage: timeout", !1, t, r), o.setTimeout(function() {
				r.ontimeout && r.ontimeout();
			}, 1e4), r.src = e;
		} else t(!1);
	}
	function hn(e, t) {
		let n = new st(), r = new AbortController(), i = setTimeout(() => {
			r.abort(), gn(n, "TestPingServer: timeout", !1, t);
		}, 1e4);
		fetch(e, { signal: r.signal }).then((e) => {
			clearTimeout(i), e.ok ? gn(n, "TestPingServer: ok", !0, t) : gn(n, "TestPingServer: server error", !1, t);
		}).catch(() => {
			clearTimeout(i), gn(n, "TestPingServer: error", !1, t);
		});
	}
	function gn(e, t, n, r, i) {
		try {
			i && (i.onload = null, i.onerror = null, i.onabort = null, i.ontimeout = null), r(n);
		} catch {}
	}
	function _n() {
		this.g = new Ke();
	}
	function vn(e) {
		this.i = e.Sb || null, this.h = e.ab || !1;
	}
	d(vn, qe), vn.prototype.g = function() {
		return new yn(this.i, this.h);
	};
	function yn(e, t) {
		Fe.call(this), this.H = e, this.o = t, this.m = void 0, this.status = this.readyState = 0, this.responseType = this.responseText = this.response = this.statusText = "", this.onreadystatechange = null, this.A = new Headers(), this.h = null, this.F = "GET", this.D = "", this.g = !1, this.B = this.j = this.l = null, this.v = new AbortController();
	}
	d(yn, Fe), e = yn.prototype, e.open = function(e, t) {
		if (this.readyState != 0) throw this.abort(), Error("Error reopening a connection");
		this.F = e, this.D = t, this.readyState = 1, Sn(this);
	}, e.send = function(e) {
		if (this.readyState != 1) throw this.abort(), Error("need to call open() first. ");
		if (this.v.signal.aborted) throw this.abort(), Error("Request was aborted.");
		this.g = !0;
		let t = {
			headers: this.A,
			method: this.F,
			credentials: this.m,
			cache: void 0,
			signal: this.v.signal
		};
		e && (t.body = e), (this.H || o).fetch(new Request(this.D, t)).then(this.Pa.bind(this), this.ga.bind(this));
	}, e.abort = function() {
		this.response = this.responseText = "", this.A = new Headers(), this.status = 0, this.v.abort(), this.j && this.j.cancel("Request was aborted.").catch(() => {}), this.readyState >= 1 && this.g && this.readyState != 4 && (this.g = !1, xn(this)), this.readyState = 0;
	}, e.Pa = function(e) {
		if (this.g && (this.l = e, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = e.headers, this.readyState = 2, Sn(this)), this.g && (this.readyState = 3, Sn(this), this.g))) {
			if (this.responseType === "arraybuffer") e.arrayBuffer().then(this.Na.bind(this), this.ga.bind(this));
			else if (o.ReadableStream !== void 0 && "body" in e) {
				if (this.j = e.body.getReader(), this.o) {
					if (this.responseType) throw Error("responseType must be empty for \"streamBinaryChunks\" mode responses.");
					this.response = [];
				} else this.response = this.responseText = "", this.B = new TextDecoder();
				bn(this);
			} else e.text().then(this.Oa.bind(this), this.ga.bind(this));
		}
	};
	function bn(e) {
		e.j.read().then(e.Ma.bind(e)).catch(e.ga.bind(e));
	}
	e.Ma = function(e) {
		if (this.g) {
			if (this.o && e.value) this.response.push(e.value);
			else if (!this.o) {
				var t = e.value ? e.value : /* @__PURE__ */ new Uint8Array();
				(t = this.B.decode(t, { stream: !e.done })) && (this.response = this.responseText += t);
			}
			e.done ? xn(this) : Sn(this), this.readyState == 3 && bn(this);
		}
	}, e.Oa = function(e) {
		this.g && (this.response = this.responseText = e, xn(this));
	}, e.Na = function(e) {
		this.g && (this.response = e, xn(this));
	}, e.ga = function() {
		this.g && xn(this);
	};
	function xn(e) {
		e.readyState = 4, e.l = null, e.j = null, e.B = null, Sn(e);
	}
	e.setRequestHeader = function(e, t) {
		this.A.append(e, t);
	}, e.getResponseHeader = function(e) {
		return this.h && this.h.get(e.toLowerCase()) || "";
	}, e.getAllResponseHeaders = function() {
		if (!this.h) return "";
		let e = [], t = this.h.entries();
		for (var n = t.next(); !n.done;) n = n.value, e.push(n[0] + ": " + n[1]), n = t.next();
		return e.join("\r\n");
	};
	function Sn(e) {
		e.onreadystatechange && e.onreadystatechange.call(e);
	}
	Object.defineProperty(yn.prototype, "withCredentials", {
		get: function() {
			return this.m === "include";
		},
		set: function(e) {
			this.m = e ? "include" : "same-origin";
		}
	});
	function Cn(e) {
		let t = "";
		return ge(e, function(e, n) {
			t += n, t += ":", t += e, t += "\r\n";
		}), t;
	}
	function wn(e, t, n) {
		a: {
			for (r in n) {
				var r = !1;
				break a;
			}
			r = !0;
		}
		r || (n = Cn(n), typeof e == "string" || b(e, t, n));
	}
	function x(e) {
		Fe.call(this), this.headers = /* @__PURE__ */ new Map(), this.L = e || null, this.h = !1, this.g = null, this.D = "", this.o = 0, this.l = "", this.j = this.B = this.v = this.A = !1, this.m = null, this.F = "", this.H = !1;
	}
	d(x, Fe);
	var Tn = /^https?$/i, En = ["POST", "PUT"];
	e = x.prototype, e.Fa = function(e) {
		this.H = e;
	}, e.ea = function(e, t, n, r) {
		if (this.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.D + "; newUri=" + e);
		t = t ? t.toUpperCase() : "GET", this.D = e, this.l = "", this.o = 0, this.A = !1, this.h = !0, this.g = this.L ? this.L.g() : ht.g(), this.g.onreadystatechange = f(l(this.Ca, this));
		try {
			this.B = !0, this.g.open(t, String(e), !0), this.B = !1;
		} catch (e) {
			Dn(this, e);
			return;
		}
		if (e = n || "", n = new Map(this.headers), r) {
			if (Object.getPrototypeOf(r) === Object.prototype) for (var i in r) n.set(i, r[i]);
			else if (typeof r.keys == "function" && typeof r.get == "function") for (let e of r.keys()) n.set(e, r.get(e));
			else throw Error("Unknown input type for opt_headers: " + String(r));
		}
		r = Array.from(n.keys()).find((e) => e.toLowerCase() == "content-type"), i = o.FormData && e instanceof o.FormData, !(Array.prototype.indexOf.call(En, t, void 0) >= 0) || r || i || n.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		for (let [e, t] of n) this.g.setRequestHeader(e, t);
		this.F && (this.g.responseType = this.F), "withCredentials" in this.g && this.g.withCredentials !== this.H && (this.g.withCredentials = this.H);
		try {
			this.m &&= (clearTimeout(this.m), null), this.v = !0, this.g.send(e), this.v = !1;
		} catch (e) {
			Dn(this, e);
		}
	};
	function Dn(e, t) {
		e.h = !1, e.g && (e.j = !0, e.g.abort(), e.j = !1), e.l = t, e.o = 5, On(e), kn(e);
	}
	function On(e) {
		e.A || (e.A = !0, Ie(e, "complete"), Ie(e, "error"));
	}
	e.abort = function(e) {
		this.g && this.h && (this.h = !1, this.j = !0, this.g.abort(), this.j = !1, this.o = e || 7, Ie(this, "complete"), Ie(this, "abort"), kn(this));
	}, e.N = function() {
		this.g && (this.h && (this.h = !1, this.j = !0, this.g.abort(), this.j = !1), kn(this, !0)), x.Z.N.call(this);
	}, e.Ca = function() {
		this.u || (this.B || this.v || this.j ? S(this) : this.Xa());
	}, e.Xa = function() {
		S(this);
	};
	function S(e) {
		if (e.h && a !== void 0) {
			if (e.v && An(e) == 4) setTimeout(e.Ca.bind(e), 0);
			else if (Ie(e, "readystatechange"), An(e) == 4) {
				e.h = !1;
				try {
					let a = e.ca();
					a: switch (a) {
						case 200:
						case 201:
						case 202:
						case 204:
						case 206:
						case 304:
						case 1223:
							var t = !0;
							break a;
						default: t = !1;
					}
					var n;
					if (!(n = t)) {
						var r;
						if (r = a === 0) {
							let t = String(e.D).match(Ht)[1] || null;
							!t && o.self && o.self.location && (t = o.self.location.protocol.slice(0, -1)), r = !Tn.test(t ? t.toLowerCase() : "");
						}
						n = r;
					}
					if (n) Ie(e, "complete"), Ie(e, "success");
					else {
						e.o = 6;
						try {
							var i = An(e) > 2 ? e.g.statusText : "";
						} catch {
							i = "";
						}
						e.l = i + " [" + e.ca() + "]", On(e);
					}
				} finally {
					kn(e);
				}
			}
		}
	}
	function kn(e, t) {
		if (e.g) {
			e.m &&= (clearTimeout(e.m), null);
			let n = e.g;
			e.g = null, t || Ie(e, "ready");
			try {
				n.onreadystatechange = null;
			} catch {}
		}
	}
	e.isActive = function() {
		return !!this.g;
	};
	function An(e) {
		return e.g ? e.g.readyState : 0;
	}
	e.ca = function() {
		try {
			return An(this) > 2 ? this.g.status : -1;
		} catch {
			return -1;
		}
	}, e.la = function() {
		try {
			return this.g ? this.g.responseText : "";
		} catch {
			return "";
		}
	}, e.La = function(e) {
		if (this.g) {
			var t = this.g.responseText;
			return e && t.indexOf(e) == 0 && (t = t.substring(e.length)), Ge(t);
		}
	};
	function jn(e) {
		try {
			if (!e.g) return null;
			if ("response" in e.g) return e.g.response;
			switch (e.F) {
				case "":
				case "text": return e.g.responseText;
				case "arraybuffer": if ("mozResponseArrayBuffer" in e.g) return e.g.mozResponseArrayBuffer;
			}
			return null;
		} catch {
			return null;
		}
	}
	function Mn(e) {
		let t = {};
		e = (e.g && An(e) >= 2 && e.g.getAllResponseHeaders() || "").split("\r\n");
		for (let r = 0; r < e.length; r++) {
			if (ue(e[r])) continue;
			var n = vt(e[r]);
			let i = n[0];
			if (n = n[1], typeof n != "string") continue;
			n = n.trim();
			let a = t[i] || [];
			t[i] = a, a.push(n);
		}
		_e(t, function(e) {
			return e.join(", ");
		});
	}
	e.ya = function() {
		return this.o;
	}, e.Ha = function() {
		return typeof this.l == "string" ? this.l : String(this.l);
	};
	function Nn(e, t, n) {
		return n && n.internalChannelParams && n.internalChannelParams[e] || t;
	}
	function Pn(e) {
		this.za = 0, this.i = [], this.j = new st(), this.ba = this.na = this.J = this.W = this.g = this.wa = this.G = this.H = this.u = this.U = this.o = null, this.Ya = this.V = 0, this.Sa = Nn("failFast", !1, e), this.F = this.C = this.v = this.m = this.l = null, this.X = !0, this.xa = this.K = -1, this.Y = this.A = this.D = 0, this.Qa = Nn("baseRetryDelayMs", 5e3, e), this.Za = Nn("retryDelaySeedMs", 1e4, e), this.Ta = Nn("forwardChannelMaxRetries", 2, e), this.va = Nn("forwardChannelRequestTimeoutMs", 2e4, e), this.ma = e && e.xmlHttpFactory || void 0, this.Ua = e && e.Rb || void 0, this.Aa = e && e.useFetchStreams || !1, this.O = void 0, this.L = e && e.supportsCrossDomainXhr || !1, this.M = "", this.h = new Ft(e && e.concurrentRequestLimit), this.Ba = new _n(), this.S = e && e.fastHandshake || !1, this.R = e && e.encodeInitMessageHeaders || !1, this.S && this.R && (this.R = !1), this.Ra = e && e.Pb || !1, e && e.ua && this.j.ua(), e && e.forceLongPolling && (this.X = !1), this.aa = !this.S && this.X && e && e.detectBufferingProxy || !1, this.ia = void 0, e && e.longPollingTimeout && e.longPollingTimeout > 0 && (this.ia = e.longPollingTimeout), this.ta = void 0, this.T = 0, this.P = !1, this.ja = this.B = null;
	}
	e = Pn.prototype, e.ka = 8, e.I = 1, e.connect = function(e, t, n, r) {
		it(0), this.W = e, this.H = t || {}, n && r !== void 0 && (this.H.OSID = n, this.H.OAID = r), this.F = this.X, this.J = Qn(this, null, this.W), Rn(this);
	};
	function Fn(e) {
		if (Ln(e), e.I == 3) {
			var t = e.V++, n = Gt(e.J);
			if (b(n, "SID", e.M), b(n, "RID", t), b(n, "TYPE", "terminate"), Vn(e, n), t = new yt(e, e.j, t), t.M = 2, t.A = Yt(Gt(n)), n = !1, o.navigator && o.navigator.sendBeacon) try {
				n = o.navigator.sendBeacon(t.A.toString(), "");
			} catch {}
			!n && o.Image && (new Image().src = t.A, n = !0), n || (t.g = $n(t.j, null), t.g.ea(t.A)), t.F = Date.now(), Ot(t);
		}
		Zn(e);
	}
	function In(e) {
		e.g &&= (Gn(e), e.g.cancel(), null);
	}
	function Ln(e) {
		In(e), e.v &&= (o.clearTimeout(e.v), null), qn(e), e.h.cancel(), e.m &&= (typeof e.m == "number" && o.clearTimeout(e.m), null);
	}
	function Rn(e) {
		if (!It(e.h) && !e.m) {
			e.m = !0;
			var t = e.Ea;
			ne || ae(), re ||= (ne(), !0), ie.add(t, e), e.D = 0;
		}
	}
	function zn(e, t) {
		return Lt(e.h) >= e.h.j - +!!e.m ? !1 : e.m ? (e.i = t.G.concat(e.i), !0) : e.I == 1 || e.I == 2 || e.D >= (e.Sa ? 0 : e.Ta) ? !1 : (e.m = ot(l(e.Ea, e, t), Yn(e, e.D)), e.D++, !0);
	}
	e.Ea = function(e) {
		if (this.m) {
			if (this.m = null, this.I == 1) {
				if (!e) {
					this.V = Math.floor(Math.random() * 1e5), e = this.V++;
					let i = new yt(this, this.j, e), a = this.o;
					if (this.U && (a ? (a = ve(a), be(a, this.U)) : a = this.U), this.u !== null || this.R || (i.J = a, a = null), this.S) a: {
						for (var t = 0, n = 0; n < this.i.length; n++) {
							b: {
								var r = this.i[n];
								if ("__data__" in r.map && (r = r.map.__data__, typeof r == "string")) {
									r = r.length;
									break b;
								}
								r = void 0;
							}
							if (r === void 0) break;
							if (t += r, t > 4096) {
								t = n;
								break a;
							}
							if (t === 4096 || n === this.i.length - 1) {
								t = n + 1;
								break a;
							}
						}
						t = 1e3;
					}
					else t = 1e3;
					t = Hn(this, i, t), n = Gt(this.J), b(n, "RID", e), b(n, "CVER", 22), this.G && b(n, "X-HTTP-Session-Id", this.G), Vn(this, n), a && (this.R ? t = "headers=" + _t(Cn(a)) + "&" + t : this.u && wn(n, this.u, a)), zt(this.h, i), this.Ra && b(n, "TYPE", "init"), this.S ? (b(n, "$req", t), b(n, "SID", "null"), i.U = !0, Ct(i, n, null)) : Ct(i, n, t), this.I = 2;
				}
			} else this.I == 3 && (e ? Bn(this, e) : this.i.length == 0 || It(this.h) || Bn(this));
		}
	};
	function Bn(e, t) {
		var n = t ? t.l : e.V++;
		let r = Gt(e.J);
		b(r, "SID", e.M), b(r, "RID", n), b(r, "AID", e.K), Vn(e, r), e.u && e.o && wn(r, e.u, e.o), n = new yt(e, e.j, n, e.D + 1), e.u === null && (n.J = e.o), t && (e.i = t.G.concat(e.i)), t = Hn(e, n, 1e3), n.H = Math.round(e.va * .5) + Math.round(e.va * .5 * Math.random()), zt(e.h, n), Ct(n, r, t);
	}
	function Vn(e, t) {
		e.H && ge(e.H, function(e, n) {
			b(t, n, e);
		}), e.l && ge({}, function(e, n) {
			b(t, n, e);
		});
	}
	function Hn(e, t, n) {
		n = Math.min(e.i.length, n);
		let r = e.l ? l(e.l.Ka, e.l, e) : null;
		a: {
			var i = e.i;
			let t = -1;
			for (;;) {
				let e = ["count=" + n];
				t == -1 ? n > 0 ? (t = i[0].g, e.push("ofs=" + t)) : t = 0 : e.push("ofs=" + t);
				let c = !0;
				for (let l = 0; l < n; l++) {
					var a = i[l].g;
					let n = i[l].map;
					if (a -= t, a < 0) t = Math.max(0, i[l].g - 100), c = !1;
					else try {
						a = "req" + a + "_" || "";
						try {
							var o = n instanceof Map ? n : Object.entries(n);
							for (let [t, n] of o) {
								let r = n;
								s(n) && (r = We(n)), e.push(a + t + "=" + encodeURIComponent(r));
							}
						} catch (t) {
							throw e.push(a + "type=_badmap"), t;
						}
					} catch {
						r && r(n);
					}
				}
				if (c) {
					o = e.join("&");
					break a;
				}
			}
			o = void 0;
		}
		return e = e.i.splice(0, n), t.G = e, o;
	}
	function Un(e) {
		if (!e.g && !e.v) {
			e.Y = 1;
			var t = e.Da;
			ne || ae(), re ||= (ne(), !0), ie.add(t, e), e.A = 0;
		}
	}
	function Wn(e) {
		return e.g || e.v || e.A >= 3 ? !1 : (e.Y++, e.v = ot(l(e.Da, e), Yn(e, e.A)), e.A++, !0);
	}
	e.Da = function() {
		if (this.v = null, Kn(this), this.aa && !(this.P || this.g == null || this.T <= 0)) {
			var e = 4 * this.T;
			this.j.info("BP detection timer enabled: " + e), this.B = ot(l(this.Wa, this), e);
		}
	}, e.Wa = function() {
		this.B && (this.B = null, this.j.info("BP detection timeout reached."), this.j.info("Buffering proxy detected and switch to long-polling!"), this.F = !1, this.P = !0, it(10), In(this), Kn(this));
	};
	function Gn(e) {
		e.B != null && (o.clearTimeout(e.B), e.B = null);
	}
	function Kn(e) {
		e.g = new yt(e, e.j, "rpc", e.Y), e.u === null && (e.g.J = e.o), e.g.P = 0;
		var t = Gt(e.na);
		b(t, "RID", "rpc"), b(t, "SID", e.M), b(t, "AID", e.K), b(t, "CI", e.F ? "0" : "1"), !e.F && e.ia && b(t, "TO", e.ia), b(t, "TYPE", "xmlhttp"), Vn(e, t), e.u && e.o && wn(t, e.u, e.o), e.O && (e.g.H = e.O);
		var n = e.g;
		e = e.ba, n.M = 1, n.A = Yt(Gt(t)), n.u = null, n.R = !0, wt(n, e);
	}
	e.Va = function() {
		this.C != null && (this.C = null, In(this), Wn(this), it(19));
	};
	function qn(e) {
		e.C != null && (o.clearTimeout(e.C), e.C = null);
	}
	function Jn(e, t) {
		var n = null;
		if (e.g == t) {
			qn(e), Gn(e), e.g = null;
			var r = 2;
		} else if (Rt(e.h, t)) n = t.G, Bt(e.h, t), r = 1;
		else return;
		if (e.I != 0) {
			if (t.o) {
				if (r == 1) {
					n = t.u ? t.u.length : 0, t = Date.now() - t.F;
					var i = e.D;
					r = et(), Ie(r, new at(r, n)), Rn(e);
				} else Un(e);
			} else if (i = t.m, i == 3 || i == 0 && t.X > 0 || !(r == 1 && zn(e, t) || r == 2 && Wn(e))) switch (n && n.length > 0 && (t = e.h, t.i = t.i.concat(n)), i) {
				case 1:
					Xn(e, 5);
					break;
				case 4:
					Xn(e, 10);
					break;
				case 3:
					Xn(e, 6);
					break;
				default: Xn(e, 2);
			}
		}
	}
	function Yn(e, t) {
		let n = e.Qa + Math.floor(Math.random() * e.Za);
		return e.isActive() || (n *= 2), n * t;
	}
	function Xn(e, t) {
		if (e.j.info("Error code " + t), t == 2) {
			var n = l(e.bb, e), r = e.Ua;
			let t = !r;
			r = new Wt(r || "//www.google.com/images/cleardot.gif"), o.location && o.location.protocol == "http" || Kt(r, "https"), Yt(r), t ? mn(r.toString(), n) : hn(r.toString(), n);
		} else it(2);
		e.I = 0, e.l && e.l.pa(t), Zn(e), Ln(e);
	}
	e.bb = function(e) {
		e ? (this.j.info("Successfully pinged google.com"), it(2)) : (this.j.info("Failed to ping google.com"), it(1));
	};
	function Zn(e) {
		if (e.I = 0, e.ja = [], e.l) {
			let t = Vt(e.h);
			(t.length != 0 || e.i.length != 0) && (m(e.ja, t), m(e.ja, e.i), e.h.i.length = 0, p(e.i), e.i.length = 0), e.l.oa();
		}
	}
	function Qn(e, t, n) {
		var r = n instanceof Wt ? Gt(n) : new Wt(n);
		if (r.g != "") t && (r.g = t + "." + r.g), qt(r, r.u);
		else {
			var i = o.location;
			r = i.protocol, t = t ? t + "." + i.hostname : i.hostname, i = +i.port;
			let e = new Wt(null);
			r && Kt(e, r), t && (e.g = t), i && qt(e, i), n && (e.h = n), r = e;
		}
		return n = e.G, t = e.wa, n && t && b(r, n, t), b(r, "VER", e.ka), Vn(e, r), r;
	}
	function $n(e, t, n) {
		if (t && !e.L) throw Error("Can't create secondary domain capable XhrIo object.");
		return t = e.Aa && !e.ma ? new x(new vn({ ab: n })) : new x(e.ma), t.Fa(e.L), t;
	}
	e.isActive = function() {
		return !!this.l && this.l.isActive(this);
	};
	function er() {}
	e = er.prototype, e.ra = function() {}, e.qa = function() {}, e.pa = function() {}, e.oa = function() {}, e.isActive = function() {
		return !0;
	}, e.Ka = function() {};
	function tr() {}
	tr.prototype.g = function(e, t) {
		return new nr(e, t);
	};
	function nr(e, t) {
		Fe.call(this), this.g = new Pn(t), this.l = e, this.h = t && t.messageUrlParams || null, e = t && t.messageHeaders || null, t && t.clientProtocolHeaderRequired && (e ? e["X-Client-Protocol"] = "webchannel" : e = { "X-Client-Protocol": "webchannel" }), this.g.o = e, e = t && t.initMessageHeaders || null, t && t.messageContentType && (e ? e["X-WebChannel-Content-Type"] = t.messageContentType : e = { "X-WebChannel-Content-Type": t.messageContentType }), t && t.sa && (e ? e["X-WebChannel-Client-Profile"] = t.sa : e = { "X-WebChannel-Client-Profile": t.sa }), this.g.U = e, (e = t && t.Qb) && !ue(e) && (this.g.u = e), this.A = t && t.supportsCrossDomainXhr || !1, this.v = t && t.sendRawJson || !1, (t &&= t.httpSessionIdParam) && !ue(t) && (this.g.G = t, e = this.h, e !== null && t in e && (e = this.h, t in e && delete e[t])), this.j = new ar(this);
	}
	d(nr, Fe), nr.prototype.m = function() {
		this.g.l = this.j, this.A && (this.g.L = !0), this.g.connect(this.l, this.h || void 0);
	}, nr.prototype.close = function() {
		Fn(this.g);
	}, nr.prototype.o = function(e) {
		var t = this.g;
		if (typeof e == "string") {
			var n = {};
			n.__data__ = e, e = n;
		} else this.v && (n = {}, n.__data__ = We(e), e = n);
		t.i.push(new Pt(t.Ya++, e)), t.I == 3 && Rn(t);
	}, nr.prototype.N = function() {
		this.g.l = null, delete this.j, Fn(this.g), delete this.g, nr.Z.N.call(this);
	};
	function rr(e) {
		Xe.call(this), e.__headers__ && (this.headers = e.__headers__, this.statusCode = e.__status__, delete e.__headers__, delete e.__status__);
		var t = e.__sm__;
		if (t) {
			a: {
				for (let n in t) {
					e = n;
					break a;
				}
				e = void 0;
			}
			(this.i = e) && (e = this.i, t = t !== null && e in t ? t[e] : void 0), this.data = t;
		} else this.data = e;
	}
	d(rr, Xe);
	function ir() {
		Ze.call(this), this.status = 1;
	}
	d(ir, Ze);
	function ar(e) {
		this.g = e;
	}
	d(ar, er), ar.prototype.ra = function() {
		Ie(this.g, "a");
	}, ar.prototype.qa = function(e) {
		Ie(this.g, new rr(e));
	}, ar.prototype.pa = function(e) {
		Ie(this.g, new ir());
	}, ar.prototype.oa = function() {
		Ie(this.g, "b");
	}, tr.prototype.createWebChannel = tr.prototype.g, nr.prototype.send = nr.prototype.o, nr.prototype.open = nr.prototype.m, nr.prototype.close = nr.prototype.close, Ko = Ro.createWebChannelTransport = function() {
		return new tr();
	}, Go = Ro.getStatEventTarget = function() {
		return et();
	}, Wo = Ro.Event = Qe, Uo = Ro.Stat = {
		jb: 0,
		mb: 1,
		nb: 2,
		Hb: 3,
		Mb: 4,
		Jb: 5,
		Kb: 6,
		Ib: 7,
		Gb: 8,
		Lb: 9,
		PROXY: 10,
		NOPROXY: 11,
		Eb: 12,
		Ab: 13,
		Bb: 14,
		zb: 15,
		Cb: 16,
		Db: 17,
		fb: 18,
		eb: 19,
		gb: 20
	}, pt.NO_ERROR = 0, pt.TIMEOUT = 8, pt.HTTP_ERROR = 6, Ho = Ro.ErrorCode = pt, mt.COMPLETE = "complete", Vo = Ro.EventType = mt, Je.EventType = Ye, Ye.OPEN = "a", Ye.CLOSE = "b", Ye.ERROR = "c", Ye.MESSAGE = "d", Fe.prototype.listen = Fe.prototype.J, Bo = Ro.WebChannel = Je, x.prototype.listenOnce = x.prototype.K, x.prototype.getLastError = x.prototype.Ha, x.prototype.getLastErrorCode = x.prototype.ya, x.prototype.getStatus = x.prototype.ca, x.prototype.getResponseJson = x.prototype.La, x.prototype.getResponseText = x.prototype.la, x.prototype.send = x.prototype.ea, x.prototype.setWithCredentials = x.prototype.Fa, zo = Ro.XhrIo = x;
}).apply(Lo === void 0 ? typeof self < "u" ? self : typeof window < "u" ? window : {} : Lo);
//#endregion
//#region node_modules/re2js/build/index.js
var C = class e {
	static FOLD_CASE = 1;
	static LITERAL = 2;
	static CLASS_NL = 4;
	static DOT_NL = 8;
	static ONE_LINE = 16;
	static NON_GREEDY = 32;
	static PERL_X = 64;
	static UNICODE_GROUPS = 128;
	static WAS_DOLLAR = 256;
	static LOOKBEHIND = 512;
	static MATCH_NL = e.CLASS_NL | e.DOT_NL;
	static PERL = e.CLASS_NL | e.ONE_LINE | e.PERL_X | e.UNICODE_GROUPS;
	static POSIX = 0;
	static UNANCHORED = 0;
	static ANCHOR_START = 1;
	static ANCHOR_BOTH = 2;
}, qo = {
	CASE_INSENSITIVE: 1,
	DOTALL: 2,
	MULTILINE: 4,
	DISABLE_UNICODE_GROUPS: 8,
	LONGEST_MATCH: 16,
	LOOKBEHINDS: 512
}, Jo = 128, Yo = new Int32Array(Jo), Xo = new Int32Array(Jo), Zo = 65535;
for (let e = 0; e < Jo; e++) e >= 97 && e <= 122 ? Yo[e] = e - 32 : Yo[e] = e, e >= 65 && e <= 90 ? Xo[e] = e + 32 : Xo[e] = e;
var w = class {
	static CODES = /* @__PURE__ */ new Map([
		["\x07", 7],
		["\b", 8],
		["	", 9],
		["\n", 10],
		["\v", 11],
		["\f", 12],
		["\r", 13],
		[" ", 32],
		["\"", 34],
		["$", 36],
		["&", 38],
		["'", 39],
		["(", 40],
		[")", 41],
		["*", 42],
		["+", 43],
		["-", 45],
		[".", 46],
		["0", 48],
		["1", 49],
		["2", 50],
		["3", 51],
		["4", 52],
		["5", 53],
		["6", 54],
		["7", 55],
		["8", 56],
		["9", 57],
		[":", 58],
		["<", 60],
		[">", 62],
		["?", 63],
		["A", 65],
		["B", 66],
		["C", 67],
		["F", 70],
		["P", 80],
		["Q", 81],
		["U", 85],
		["Z", 90],
		["[", 91],
		["\\", 92],
		["]", 93],
		["^", 94],
		["_", 95],
		["`", 96],
		["a", 97],
		["b", 98],
		["f", 102],
		["i", 105],
		["m", 109],
		["n", 110],
		["r", 114],
		["s", 115],
		["t", 116],
		["v", 118],
		["x", 120],
		["z", 122],
		["{", 123],
		["|", 124],
		["}", 125]
	]);
	static toUpperCase(e) {
		if (e < Jo) return Yo[e];
		let t = String.fromCodePoint(e).toUpperCase(), n = t.codePointAt(0) > Zo ? 2 : 1;
		if (t.length > n) return e;
		let r = String.fromCodePoint(t.codePointAt(0)).toLowerCase(), i = r.codePointAt(0) > Zo ? 2 : 1;
		return r.length > i || r.codePointAt(0) !== e ? e : t.codePointAt(0);
	}
	static toLowerCase(e) {
		if (e < Jo) return Xo[e];
		let t = String.fromCodePoint(e).toLowerCase(), n = t.codePointAt(0) > Zo ? 2 : 1;
		if (t.length > n) return e;
		let r = String.fromCodePoint(t.codePointAt(0)).toUpperCase(), i = r.codePointAt(0) > Zo ? 2 : 1;
		return r.length > i || r.codePointAt(0) !== e ? e : t.codePointAt(0);
	}
}, T = class {
	constructor(e, t = !1) {
		this.data = e, this.isStride1 = t, this.SIZE = t ? 2 : 3;
	}
	getLo(e) {
		return this.data[e * this.SIZE];
	}
	getHi(e) {
		return this.data[e * this.SIZE + 1];
	}
	getStride(e) {
		return this.isStride1 ? 1 : this.data[e * this.SIZE + 2];
	}
	get length() {
		return this.data.length / this.SIZE;
	}
}, Qo = /* @__PURE__ */ new Uint8Array(256);
for (let e = 0; e < 64; e++) Qo["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-".charCodeAt(e)] = e;
var $o = (e) => {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = Qo[e.charCodeAt(i)];
		n |= (a & 31) << r, a & 32 ? r += 5 : (t.push(n), n = 0, r = 0);
	}
	return t;
}, E = (e, t) => {
	let n = $o(e), r = t ? n.length / 2 : n.length / 3, i = new Uint32Array(r * 3), a = 0, o = 0;
	for (let e = 0; e < r; e++) a += n[o++], i[e * 3] = a, a += n[o++], i[e * 3 + 1] = a, i[e * 3 + 2] = t ? 1 : n[o++];
	return i;
}, es = (e) => {
	let t = $o(e), n = /* @__PURE__ */ new Map(), r = 0;
	for (let e = 0; e < t.length; e += 2) {
		r += t[e];
		let i = t[e + 1], a = i >>> 1 ^ -(i & 1);
		n.set(r, r + a);
	}
	return n;
}, ts = class {
	constructor(e) {
		this.initializer = e, this.cache = /* @__PURE__ */ new Map();
	}
	has(e) {
		return e in this.initializer;
	}
	get(e) {
		if (this.cache.has(e)) return this.cache.get(e);
		let t = this.initializer[e], n = t ? t() : null;
		return this.cache.set(e, n), n;
	}
}, ns = class {
	static _CASE_ORBIT = null;
	static get CASE_ORBIT() {
		return this._CASE_ORBIT ||= es("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC"), this._CASE_ORBIT;
	}
	static _Print = null;
	static get Print() {
		return this._Print ||= new T(E("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB", !1)), this._Print;
	}
	static CATEGORIES = new ts({
		C: () => new T(E("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB", !1)),
		Cc: () => new T(E("AfgDgB", !0)),
		Cf: () => new T(E("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB", !1)),
		Cn: () => new T(E("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB", !1)),
		Co: () => new T(E("gg4B-nGh4hc9--BD9--B", !0)),
		Cs: () => new T(E("gg2B--B", !0)),
		L: () => new T(E("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", !1)),
		LC: () => new T(E("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB", !1)),
		Ll: () => new T(E("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB", !1)),
		Lm: () => new T(E("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB", !1)),
		Lo: () => new T(E("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", !1)),
		Lt: () => new T(E("lOGDnB2sH2sHBGBJHBJHBNQQwBAB", !1)),
		Lu: () => new T(E("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB", !1)),
		M: () => new T(E("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB", !1)),
		Mc: () => new T(E("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB", !1)),
		Me: () => new T(E("okBBB1xF-wB-wBBCBCCBsshBCB", !1)),
		Mn: () => new T(E("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB", !1)),
		N: () => new T(E("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB", !1)),
		Nd: () => new T(E("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ", !0)),
		Nl: () => new T(E("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB", !1)),
		No: () => new T(E("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB", !1)),
		P: () => new T(E("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB", !1)),
		Pc: () => new T(E("-Cg-Hg-HBUU-u3BBBZCBwHAB", !1)),
		Pd: () => new T(E("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J", !1)),
		Pe: () => new T(E("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD", !1)),
		Pf: () => new T(E("7F+6H+6HEddpuDCCFDDQEE", !1)),
		Pi: () => new T(E("rFt7Ht7HDBBDaapuDCCFDDQEE", !1)),
		Po: () => new T(E("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB", !1)),
		Ps: () => new T(E("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB", !1)),
		S: () => new T(E("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB", !1)),
		Sc: () => new T(E("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC", !1)),
		Sk: () => new T(E("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB", !1)),
		Sm: () => new T(E("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB", !1)),
		So: () => new T(E("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB", !1)),
		Z: () => new T(E("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB", !1)),
		Zl: () => new T(E("ohIA", !0)),
		Zp: () => new T(E("phIA", !0)),
		Zs: () => new T(E("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB", !1)),
		ASCII_Hex_Digit: () => new T(E("wBJIFbF", !0)),
		Alphabetic: () => new T(E("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", !1)),
		Dash: () => new T(E("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J", !1)),
		Emoji: () => new T(E("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB", !1)),
		Emoji_Component: () => new T(E("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB", !1)),
		Emoji_Modifier: () => new T(E("7-8DE", !0)),
		Emoji_Modifier_Base: () => new T(E("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB", !1)),
		Emoji_Presentation: () => new T(E("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB", !1)),
		Extended_Pictographic: () => new T(E("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB", !1)),
		Hex_Digit: () => new T(E("wBJIFbFq1-BJIFbF", !0)),
		Lowercase: () => new T(E("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB", !1)),
		Math: () => new T(E("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB", !1)),
		Quotation_Mark: () => new T(E("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB", !1)),
		Terminal_Punctuation: () => new T(E("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB", !1)),
		Uppercase: () => new T(E("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB", !1)),
		White_Space: () => new T(E("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB", !1))
	});
	static get Upper() {
		return this.CATEGORIES.get("Lu");
	}
	static SCRIPTS = new ts({
		Adlam: () => new T(E("go6DrCFJFB", !0)),
		Ahom: () => new T(E("g4lCaDOFW", !0)),
		Anatolian_Hieroglyphs: () => new T(E("ggxCmS", !0)),
		Arabic: () => new T(E("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB", !1)),
		Armenian: () => new T(E("xpBlBDxBDCks9BE", !0)),
		Avestan: () => new T(E("g4iC1BEG", !0)),
		Balinese: () => new T(E("g4GsCCxB", !0)),
		Bamum: () => new T(E("g1pB3CpowB4R", !0)),
		Bassa_Vah: () => new T(E("w26CdDF", !0)),
		Batak: () => new T(E("g+GzBJD", !0)),
		Bengali: () => new T(E("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB", !1)),
		Beria_Erfe: () => new T(E("g17CYDY", !0)),
		Bhaiksuki: () => new T(E("ggnCICsBCNLc", !0)),
		Bopomofo: () => new T(E("qXB6wLqBxDf", !0)),
		Brahmi: () => new T(E("ggkCtCFjBKA", !0)),
		Braille: () => new T(E("ggK-H", !0)),
		Buginese: () => new T(E("gwGbDB", !0)),
		Buhid: () => new T(E("g6FT", !0)),
		Canadian_Aboriginal: () => new T(E("ggF-TxRlC7tgCP", !0)),
		Carian: () => new T(E("g1gCwB", !0)),
		Caucasian_Albanian: () => new T(E("wphCzBMA", !0)),
		Chakma: () => new T(E("gokC0BCR", !0)),
		Cham: () => new T(E("gwqB2BKNDJDD", !0)),
		Cherokee: () => new T(E("g9E1CDFz7lBvC", !0)),
		Chorasmian: () => new T(E("w9jCb", !0)),
		Common: () => new T(E("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB", !1)),
		Coptic: () => new T(E("ifNxkKzDGG", !0)),
		Cuneiform: () => new T(E("ggoC5cnDuDCEMjG", !0)),
		Cypriot: () => new T(E("ggiCFBDCCBqBBCBBEDD", !1)),
		Cypro_Minoan: () => new T(E("w8rCiD", !0)),
		Cyrillic: () => new T(E("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB", !1)),
		Deseret: () => new T(E("gghCvC", !0)),
		Devanagari: () => new T(E("goCwCFODZh7nBfhwcJ", !0)),
		Dives_Akuru: () => new T(E("gomCGBDDDBGBCBBCdBCBBDLBKJB", !1)),
		Dogra: () => new T(E("ggmC7B", !0)),
		Duployan: () => new T(E("ggvDqDGMEIIJDD", !0)),
		Egyptian_Hieroglyphs: () => new T(E("ggsC1iBL68D", !0)),
		Elbasan: () => new T(E("gohCnB", !0)),
		Elymaic: () => new T(E("g-jCW", !0)),
		Ethiopic: () => new T(E("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB", !1)),
		Garay: () => new T(E("gqjClBEcJB", !0)),
		Georgian: () => new T(E("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG", !1)),
		Glagolitic: () => new T(E("ggL-Ch9sDGCQDGCBCE", !0)),
		Gothic: () => new T(E("w5gCa", !0)),
		Grantha: () => new T(E("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB", !1)),
		Greek: () => new T(E("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB", !1)),
		Gujarati: () => new T(E("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB", !1)),
		Gunjala_Gondi: () => new T(E("grnCFCBCkBCBCFIJ", !0)),
		Gurmukhi: () => new T(E("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB", !1)),
		Gurung_Khema: () => new T(E("go4C5B", !0)),
		Han: () => new T(E("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", !1)),
		Hangul: () => new T(E("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC", !0)),
		Hanifi_Rohingya: () => new T(E("gojCnBJJ", !0)),
		Hanunoo: () => new T(E("g5FU", !0)),
		Hatran: () => new T(E("gniCSCBGE", !0)),
		Hebrew: () => new T(E("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB", !1)),
		Hiragana: () => new T(E("hiM1CBHCBi7-C+IBTeeBBBulQAB", !1)),
		Imperial_Aramaic: () => new T(E("giiCVCI", !0)),
		Inherited: () => new T(E("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB", !1)),
		Inscriptional_Pahlavi: () => new T(E("g7iCSGH", !0)),
		Inscriptional_Parthian: () => new T(E("g6iCVDH", !0)),
		Javanese: () => new T(E("gsqBtCDJFB", !0)),
		Kaithi: () => new T(E("gkkCiCLA", !0)),
		Kannada: () => new T(E("gkDMCCCWCJCEDICCCDIBGCCDDJCC", !0)),
		Katakana: () => new T(E("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB", !1)),
		Kawi: () => new T(E("g4nCQCoBEc", !0)),
		Kayah_Li: () => new T(E("goqBtBCA", !0)),
		Kharoshthi: () => new T(E("gwiCDCBGHCCCcDCFJII", !0)),
		Khitan_Small_Script: () => new T(E("k-7C84G84GB0OBqBAB", !1)),
		Khmer: () => new T(E("g8F9CDJHJnPf", !0)),
		Khojki: () => new T(E("gwkCRCuB", !0)),
		Khudawadi: () => new T(E("w1kC6BGJ", !0)),
		Kirat_Rai: () => new T(E("gq7C5B", !0)),
		Lao: () => new T(E("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB", !1)),
		Latin: () => new T(E("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB", !1)),
		Lepcha: () => new T(E("ggH3BEOEC", !0)),
		Limbu: () => new T(E("goGeBCLBFLBFEEBKB", !1)),
		Linear_A: () => new T(E("gwhC2JKVLH", !0)),
		Linear_B: () => new T(E("gggCLCZCSCBCODNjB6D", !0)),
		Lisu: () => new T(E("wmpBvBx1eA", !0)),
		Lycian: () => new T(E("g0gCc", !0)),
		Lydian: () => new T(E("gpiCZGA", !0)),
		Mahajani: () => new T(E("wqkCmB", !0)),
		Makasar: () => new T(E("g3nCY", !0)),
		Malayalam: () => new T(E("goDMCCCyBCCCFFPDZ", !0)),
		Mandaic: () => new T(E("giCbDA", !0)),
		Manichaean: () => new T(E("g2iCmBFL", !0)),
		Marchen: () => new T(E("wjnCfDVCN", !0)),
		Masaram_Gondi: () => new T(E("gonCGBCBBCrBBECCBCCBHBJJB", !1)),
		Medefaidrin: () => new T(E("gy7C6C", !0)),
		Meetei_Mayek: () => new T(E("g3qBWqGtBDJ", !0)),
		Mende_Kikakui: () => new T(E("gg6DkGDP", !0)),
		Meroitic_Cursive: () => new T(E("gtiCXFTDtB", !0)),
		Meroitic_Hieroglyphs: () => new T(E("gsiCf", !0)),
		Miao: () => new T(E("g47CqCF4BIQ", !0)),
		Modi: () => new T(E("gwlCkCMJ", !0)),
		Mongolian: () => new T(E("ggGBBDCCBSBH4CBIqBB2t-BMB", !1)),
		Mro: () => new T(E("gy6CeCJFB", !0)),
		Multani: () => new T(E("g0kCGBCCCBCBCOBCKB", !1)),
		Myanmar: () => new T(E("ggE-EhqmBeiDfxibT", !0)),
		Nabataean: () => new T(E("gkiCeJI", !0)),
		Nag_Mundari: () => new T(E("wm5DpB", !0)),
		Nandinagari: () => new T(E("gtmCHDtBDK", !0)),
		New_Tai_Lue: () => new T(E("gsGrBFZHKEB", !0)),
		Newa: () => new T(E("gglC7CCE", !0)),
		Nko: () => new T(E("g+B6BDC", !0)),
		Nushu: () => new T(E("h-7CvsQvsQBqMB", !1)),
		Nyiakeng_Puachue_Hmong: () => new T(E("go4DsBENDJFB", !0)),
		Ogham: () => new T(E("g0Fc", !0)),
		Ol_Chiki: () => new T(E("wiHvB", !0)),
		Ol_Onal: () => new T(E("wu5DqBFA", !0)),
		Old_Hungarian: () => new T(E("gkjCyBOyBIF", !0)),
		Old_Italic: () => new T(E("g4gCjBKC", !0)),
		Old_North_Arabian: () => new T(E("g0iCf", !0)),
		Old_Permic: () => new T(E("w6gCqB", !0)),
		Old_Persian: () => new T(E("g9gCjBFN", !0)),
		Old_Sogdian: () => new T(E("g4jCnB", !0)),
		Old_South_Arabian: () => new T(E("gziCf", !0)),
		Old_Turkic: () => new T(E("ggjCoC", !0)),
		Old_Uyghur: () => new T(E("w7jCZ", !0)),
		Oriya: () => new T(E("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR", !0)),
		Osage: () => new T(E("wlhCjBFjB", !0)),
		Osmanya: () => new T(E("gkhCdDJ", !0)),
		Pahawh_Hmong: () => new T(E("g46ClCLJCGCUGS", !0)),
		Palmyrene: () => new T(E("gjiCf", !0)),
		Pau_Cin_Hau: () => new T(E("g2mC4B", !0)),
		Phags_Pa: () => new T(E("giqB3B", !0)),
		Phoenician: () => new T(E("goiCbEA", !0)),
		Psalter_Pahlavi: () => new T(E("g8iCRIDNG", !0)),
		Rejang: () => new T(E("wpqBjBMA", !0)),
		Runic: () => new T(E("g1FqCEK", !0)),
		Samaritan: () => new T(E("ggCtBDO", !0)),
		Saurashtra: () => new T(E("gkqBlCJL", !0)),
		Sharada: () => new T(E("gskC-ChsCH", !0)),
		Shavian: () => new T(E("wihCvB", !0)),
		Siddham: () => new T(E("gslC1BDlB", !0)),
		Sidetic: () => new T(E("gqiCZ", !0)),
		SignWriting: () => new T(E("gg2DrUQECO", !0)),
		Sinhala: () => new T(E("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB", !1)),
		Sogdian: () => new T(E("w5jCpB", !0)),
		Sora_Sompeng: () => new T(E("wmkCYIJ", !0)),
		Soyombo: () => new T(E("wymCyC", !0)),
		Sundanese: () => new T(E("g8G-BhIH", !0)),
		Sunuwar: () => new T(E("g+mChBPJ", !0)),
		Syloti_Nagri: () => new T(E("ggqBsB", !0)),
		Syriac: () => new T(E("g4BNC7BDCxIK", !0)),
		Tagalog: () => new T(E("g4FVKA", !0)),
		Tagbanwa: () => new T(E("g7FMCCCB", !0)),
		Tai_Le: () => new T(E("wqGdDE", !0)),
		Tai_Tham: () => new T(E("gxG+BCcDKHJHN", !0)),
		Tai_Viet: () => new T(E("g0qBiCZE", !0)),
		Tai_Yo: () => new T(E("g25DeCVJB", !0)),
		Takri: () => new T(E("g0lC5BHJ", !0)),
		Tamil: () => new T(E("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB", !1)),
		Tangsa: () => new T(E("wz6CuCCJ", !0)),
		Tangut: () => new T(E("g-7CgBgBB+3GBhQeBiDyDB", !1)),
		Telugu: () => new T(E("ggDMCCCWCPDICCCDIBCCCBDDDJII", !0)),
		Thaana: () => new T(E("g8BxB", !0)),
		Thai: () => new T(E("hwD5BGb", !0)),
		Tibetan: () => new T(E("g4DnCCjBFmBCjBCOCGFB", !0)),
		Tifinagh: () => new T(E("wpL3BIBPA", !0)),
		Tirhuta: () => new T(E("gklCnCJJ", !0)),
		Todhri: () => new T(E("guhCzB", !0)),
		Tolong_Siki: () => new T(E("wtnCrBFJ", !0)),
		Toto: () => new T(E("w04De", !0)),
		Tulu_Tigalari: () => new T(E("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB", !1)),
		Ugaritic: () => new T(E("g8gCdCA", !0)),
		Unknown: () => new T(E("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB", !1)),
		Vai: () => new T(E("gopBrJ", !0)),
		Vithkuqi: () => new T(E("wrhCKCOCGCBCKCOCGCB", !0)),
		Wancho: () => new T(E("g24D5BGA", !0)),
		Warang_Citi: () => new T(E("glmCyCNA", !0)),
		Yezidi: () => new T(E("g0jCpBCCDB", !0)),
		Yi: () => new T(E("ggoBskBE2B", !0)),
		Zanabazar_Square: () => new T(E("gwmCnC", !0))
	});
	static FOLD_CATEGORIES = new ts({
		L: () => new T(E("laA", !0)),
		LC: () => new T(E("laA", !0)),
		Ll: () => new T(E("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB", !1)),
		Lt: () => new T(E("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB", !1)),
		Lu: () => new T(E("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB", !1)),
		M: () => new T(E("5cgBgBlgHAB", !1)),
		Mn: () => new T(E("5cgBgBlgHAB", !1)),
		Emoji: () => new T(E("8mJA", !0)),
		Extended_Pictographic: () => new T(E("8mJA", !0)),
		Lowercase: () => new T(E("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB", !1)),
		Math: () => new T(E("ycGDCHHFMMDDDCHHFAB", !1)),
		Uppercase: () => new T(E("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB", !1))
	});
	static FOLD_SCRIPT = new ts({
		Common: () => new T(E("8cgBgB", !1)),
		Greek: () => new T(E("1FwUwU", !1)),
		Inherited: () => new T(E("5cgBgBlgHAB", !1))
	});
}, D = class e {
	static MAX_RUNE = 1114111;
	static MAX_ASCII = 127;
	static MAX_LATIN1 = 255;
	static MAX_BMP = 65535;
	static MIN_FOLD = 65;
	static MAX_FOLD = 125251;
	static MIN_HIGH_SURROGATE = 55296;
	static MAX_HIGH_SURROGATE = 56319;
	static MIN_LOW_SURROGATE = 56320;
	static MAX_LOW_SURROGATE = 57343;
	static MIN_SUPPLEMENTARY_CODE_POINT = 65536;
	static is32(e, t) {
		let n = 0, r = e.length;
		for (; n < r;) {
			let i = n + Math.floor((r - n) / 2), a = e.getLo(i), o = e.getHi(i);
			if (a <= t && t <= o) {
				let n = e.getStride(i);
				return (t - a) % n === 0;
			}
			t < a ? r = i : n = i + 1;
		}
		return !1;
	}
	static is(t, n) {
		if (n <= e.MAX_LATIN1) {
			for (let e = 0; e < t.length; e++) {
				if (n > t.getHi(e)) continue;
				let r = t.getLo(e);
				if (n < r) return !1;
				let i = t.getStride(e);
				return (n - r) % i === 0;
			}
			return !1;
		}
		return t.length > 0 && n >= t.getLo(0) && e.is32(t, n);
	}
	static isUpper(t) {
		if (t <= e.MAX_LATIN1) {
			let e = String.fromCodePoint(t);
			return e.toUpperCase() === e && e.toLowerCase() !== e;
		}
		return e.is(ns.Upper, t);
	}
	static isPrint(t) {
		return t <= e.MAX_LATIN1 ? t >= 32 && t < e.MAX_ASCII || t >= 161 && t !== 173 : e.is(ns.Print, t);
	}
	static simpleFold(e) {
		if (ns.CASE_ORBIT.has(e)) return ns.CASE_ORBIT.get(e);
		let t = w.toLowerCase(e);
		return t === e ? w.toUpperCase(e) : t;
	}
	static equalsIgnoreCase(t, n) {
		if (t === n) return !0;
		if (t < 0 || n < 0) return !1;
		if (t <= e.MAX_ASCII && n <= e.MAX_ASCII) return 65 <= t && t <= 90 && (t |= 32), 65 <= n && n <= 90 && (n |= 32), t === n;
		for (let r = e.simpleFold(t); r !== t; r = e.simpleFold(r)) if (r === n) return !0;
		return !1;
	}
}, rs = 256, is = new Uint8Array(rs);
for (let e = 0; e < rs; e++) is[e] = +(97 <= e && e <= 122 || 65 <= e && e <= 90 || 48 <= e && e <= 57 || e === 95);
var as = null, os = null, O = class e {
	static METACHARACTERS = "\\.+*?()|[]{}^$";
	static EMPTY_BEGIN_LINE = 1;
	static EMPTY_END_LINE = 2;
	static EMPTY_BEGIN_TEXT = 4;
	static EMPTY_END_TEXT = 8;
	static EMPTY_WORD_BOUNDARY = 16;
	static EMPTY_NO_WORD_BOUNDARY = 32;
	static EMPTY_ALL = -1;
	static emptyInts() {
		return [];
	}
	static isByteArray(e) {
		return Array.isArray(e) || e instanceof Uint8Array;
	}
	static isalnum(e) {
		return w.CODES.get("0") <= e && e <= w.CODES.get("9") || w.CODES.get("a") <= e && e <= w.CODES.get("z") || w.CODES.get("A") <= e && e <= w.CODES.get("Z");
	}
	static unhex(e) {
		return w.CODES.get("0") <= e && e <= w.CODES.get("9") ? e - w.CODES.get("0") : w.CODES.get("a") <= e && e <= w.CODES.get("f") ? e - w.CODES.get("a") + 10 : w.CODES.get("A") <= e && e <= w.CODES.get("F") ? e - w.CODES.get("A") + 10 : -1;
	}
	static escapeRune(t) {
		let n = "";
		if (D.isPrint(t)) e.METACHARACTERS.indexOf(String.fromCodePoint(t)) >= 0 && (n += "\\"), n += String.fromCodePoint(t);
		else switch (t) {
			case w.CODES.get("\""):
				n += "\\\"";
				break;
			case w.CODES.get("\\"):
				n += "\\\\";
				break;
			case w.CODES.get("	"):
				n += "\\t";
				break;
			case w.CODES.get("\n"):
				n += "\\n";
				break;
			case w.CODES.get("\r"):
				n += "\\r";
				break;
			case w.CODES.get("\b"):
				n += "\\b";
				break;
			case w.CODES.get("\f"):
				n += "\\f";
				break;
			default: {
				let e = t.toString(16);
				t < 256 ? (n += "\\x", e.length === 1 && (n += "0"), n += e) : n += `\\x{${e}}`;
				break;
			}
		}
		return n;
	}
	static stringToRunes(e) {
		let t = String(e), n = [], r = 0;
		for (; r < t.length;) {
			let e = t.codePointAt(r);
			n.push(e), r += e > D.MAX_BMP ? 2 : 1;
		}
		return n;
	}
	static runeToString(e) {
		return String.fromCodePoint(e);
	}
	static isWordRune(e) {
		return e < rs && is[e] === 1;
	}
	static emptyOpContext(t, n) {
		let r = 0;
		return t < 0 && (r |= e.EMPTY_BEGIN_TEXT | e.EMPTY_BEGIN_LINE), t === 10 && (r |= e.EMPTY_BEGIN_LINE), n < 0 && (r |= e.EMPTY_END_TEXT | e.EMPTY_END_LINE), n === 10 && (r |= e.EMPTY_END_LINE), e.isWordRune(t) === e.isWordRune(n) ? r |= e.EMPTY_NO_WORD_BOUNDARY : r |= e.EMPTY_WORD_BOUNDARY, r;
	}
	static quoteMeta(t) {
		return t.split("").map((t) => e.METACHARACTERS.indexOf(t) >= 0 ? `\\${t}` : t).join("");
	}
	static charCount(e) {
		return e > D.MAX_BMP ? 2 : 1;
	}
	static toArray(e) {
		let t = e.length, n = Array(t);
		for (let r = 0; r < t; r++) n[r] = e[r];
		return n;
	}
	static stringToUtf8ByteArray(e) {
		if (globalThis.TextEncoder) return as ||= new TextEncoder(), as.encode(e);
		{
			let t = [], n = 0;
			for (let r = 0; r < e.length; r++) {
				let i = e.charCodeAt(r);
				i < 128 ? t[n++] = i : i < 2048 ? (t[n++] = i >> 6 | 192, t[n++] = i & 63 | 128) : (i & 64512) === D.MIN_HIGH_SURROGATE && r + 1 < e.length && (e.charCodeAt(r + 1) & 64512) === D.MIN_LOW_SURROGATE ? (i = D.MIN_SUPPLEMENTARY_CODE_POINT + ((i & 1023) << 10) + (e.charCodeAt(++r) & 1023), t[n++] = i >> 18 | 240, t[n++] = i >> 12 & 63 | 128, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128) : (t[n++] = i >> 12 | 224, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128);
			}
			return t;
		}
	}
	static utf8ByteArrayToString(e) {
		if (globalThis.TextDecoder) {
			os ||= new TextDecoder("utf-8");
			let t = e instanceof Uint8Array ? e : new Uint8Array(e);
			return os.decode(t);
		}
		{
			let t = [], n = 0, r = 0;
			for (; n < e.length;) {
				let i = e[n++];
				if (i < 128) t[r++] = String.fromCharCode(i);
				else if (i > 191 && i < 224) {
					let a = e[n++];
					t[r++] = String.fromCharCode((i & 31) << 6 | a & 63);
				} else if (i > 239 && i < 365) {
					let a = e[n++], o = e[n++], s = e[n++], c = ((i & 7) << 18 | (a & 63) << 12 | (o & 63) << 6 | s & 63) - D.MIN_SUPPLEMENTARY_CODE_POINT;
					t[r++] = String.fromCharCode(D.MIN_HIGH_SURROGATE + (c >> 10)), t[r++] = String.fromCharCode(D.MIN_LOW_SURROGATE + (c & 1023));
				} else {
					let a = e[n++], o = e[n++];
					t[r++] = String.fromCharCode((i & 15) << 12 | (a & 63) << 6 | o & 63);
				}
			}
			return t.join("");
		}
	}
}, ss = (e = [], t = 0) => {
	let n = Object.create(null);
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = t + r;
		n[i] = a, n[a] = i;
	}
	return Object.freeze(n);
}, cs = class e {
	static Encoding = ss(["UTF_16", "UTF_8"]);
	getEncoding() {
		throw Error("not implemented");
	}
	asCharSequence() {
		throw Error("not implemented");
	}
	asBytes() {
		throw Error("not implemented");
	}
	length() {
		throw Error("not implemented");
	}
	isUTF8Encoding() {
		return this.getEncoding() === e.Encoding.UTF_8;
	}
	isUTF16Encoding() {
		return this.getEncoding() === e.Encoding.UTF_16;
	}
}, ls = class extends cs {
	constructor(e = null) {
		super(), this.bytes = e;
	}
	getEncoding() {
		return cs.Encoding.UTF_8;
	}
	asCharSequence() {
		return O.utf8ByteArrayToString(this.bytes);
	}
	asBytes() {
		return this.bytes;
	}
	length() {
		return this.bytes.length;
	}
}, us = class extends cs {
	constructor(e = null) {
		super(), this.charSequence = e;
	}
	getEncoding() {
		return cs.Encoding.UTF_16;
	}
	asCharSequence() {
		return this.charSequence;
	}
	asBytes() {
		return O.stringToUtf8ByteArray(this.charSequence.toString());
	}
	length() {
		return this.charSequence.length;
	}
}, ds = class {
	static utf16(e) {
		return new us(e);
	}
	static utf8(e) {
		return O.isByteArray(e) ? new ls(e) : new ls(O.stringToUtf8ByteArray(e));
	}
}, fs = class {
	static EOF() {
		return -8;
	}
	constructor() {
		this.end = 0;
	}
	canCheckPrefix() {
		return !0;
	}
	endPos() {
		return this.end;
	}
	hasString() {
		return !1;
	}
	hasAnyString() {
		return !1;
	}
	prefixLength() {
		return 0;
	}
}, ps = class extends fs {
	constructor(e, t = 0, n = e.length) {
		super(), this.bytes = e, this.start = t, this.end = n;
	}
	hasString(e, t) {
		let n = e.bytes;
		if (n.length === 0) return !0;
		let r = this.indexOf(this.bytes, n, this.start + t);
		return r !== -1 && r <= this.end - n.length;
	}
	hasAnyString(e, t) {
		return e.ac8 ? e.ac8.searchUTF8(this.bytes, this.start + t, this.end) : !1;
	}
	step(e) {
		if (e += this.start, e >= this.end) return fs.EOF();
		let t = this.bytes[e] & 255;
		if (t < 128) return t << 3 | 1;
		if (t >= 194 && t <= 223 && e + 1 < this.end) {
			let n = this.bytes[e + 1] & 255;
			return (n & 192) == 128 ? ((t & 31) << 6 | n & 63) << 3 | 2 : t << 3 | 1;
		}
		if (t >= 224 && t <= 239 && e + 2 < this.end) {
			let n = this.bytes[e + 1] & 255;
			if ((n & 192) != 128) return t << 3 | 1;
			let r = this.bytes[e + 2] & 255;
			return (r & 192) == 128 ? ((t & 15) << 12 | (n & 63) << 6 | r & 63) << 3 | 3 : t << 3 | 1;
		}
		if (t >= 240 && t <= 244 && e + 3 < this.end) {
			let n = this.bytes[e + 1] & 255;
			if ((n & 192) != 128) return t << 3 | 1;
			let r = this.bytes[e + 2] & 255;
			if ((r & 192) != 128) return t << 3 | 1;
			let i = this.bytes[e + 3] & 255;
			return (i & 192) == 128 ? ((t & 7) << 18 | (n & 63) << 12 | (r & 63) << 6 | i & 63) << 3 | 4 : t << 3 | 1;
		}
		return t << 3 | 1;
	}
	index(e, t) {
		t += this.start;
		let n = this.indexOf(this.bytes, e.prefixUTF8, t);
		return n < 0 ? n : n - t;
	}
	context(e) {
		e += this.start;
		let t = -1;
		if (e > this.start && e <= this.end) {
			let n = e - 1;
			if (t = this.bytes[n--], t >= 128) {
				let r = e - 4;
				for (r < this.start && (r = this.start); n >= r && (this.bytes[n] & 192) == 128;) n--;
				n < this.start && (n = this.start), t = this.step(n - this.start) >> 3;
			}
		}
		let n = e < this.end ? this.step(e - this.start) >> 3 : -1;
		return O.emptyOpContext(t, n);
	}
	indexOf(e, t, n = 0) {
		let r = t.length;
		if (r === 0) return n <= this.end ? n : -1;
		let i = t[0], a = this.end - r, o = typeof e.indexOf == "function", s = n;
		for (; s <= a;) {
			if (o) {
				if (s = e.indexOf(i, s), s === -1 || s > a) return -1;
			} else {
				for (; s <= a && e[s] !== i;) s++;
				if (s > a) return -1;
			}
			let n = !0;
			for (let i = 1; i < r; i++) if (e[s + i] !== t[i]) {
				n = !1;
				break;
			}
			if (n) return s;
			s++;
		}
		return -1;
	}
	prefixLength(e) {
		return e.prefixUTF8.length;
	}
}, ms = class extends fs {
	constructor(e, t = 0, n = e.length) {
		super(), this.charSequence = e, this.start = t, this.end = n;
	}
	hasString(e, t) {
		let n = this.charSequence.indexOf(e.str, this.start + t);
		return n !== -1 && n <= this.end - e.str.length;
	}
	hasAnyString(e, t) {
		return e.ac16 ? e.ac16.searchUTF16(this.charSequence, this.start + t, this.end) : !1;
	}
	step(e) {
		if (e += this.start, e >= this.end) return fs.EOF();
		let t = this.charSequence.charCodeAt(e);
		if (t < D.MIN_HIGH_SURROGATE || t > D.MAX_HIGH_SURROGATE || e + 1 >= this.end) return t << 3 | 1;
		let n = this.charSequence.charCodeAt(e + 1);
		return n >= D.MIN_LOW_SURROGATE && n <= D.MAX_LOW_SURROGATE ? (t - D.MIN_HIGH_SURROGATE) * 1024 + (n - D.MIN_LOW_SURROGATE) + D.MIN_SUPPLEMENTARY_CODE_POINT << 3 | 2 : t << 3 | 1;
	}
	index(e, t) {
		t += this.start;
		let n = this.charSequence.indexOf(e.prefix, t);
		return n < 0 || n > this.end - e.prefix.length ? -1 : n - t;
	}
	context(e) {
		e += this.start;
		let t = e > this.start && e <= this.end ? this.charSequence.charCodeAt(e - 1) : -1, n = e < this.end ? this.charSequence.charCodeAt(e) : -1;
		return O.emptyOpContext(t, n);
	}
	prefixLength(e) {
		return e.prefix.length;
	}
}, k = class {
	static fromUTF8(e, t = 0, n = e.length) {
		return new ps(e, t, n);
	}
	static fromUTF16(e, t = 0, n = e.length) {
		return new ms(e, t, n);
	}
}, hs = class extends Error {
	constructor(e) {
		super(e), this.name = "RE2JSException";
	}
}, A = class extends hs {
	constructor(e, t = null) {
		let n = `error parsing regexp: ${e}`;
		t && (n += `: \`${t}\``), super(n), this.name = "RE2JSSyntaxException", this.message = n, this.error = e, this.input = t;
	}
	getDescription() {
		return this.error;
	}
	getPattern() {
		return this.input;
	}
}, gs = class extends hs {
	constructor(e) {
		super(e), this.name = "RE2JSCompileException";
	}
}, _s = class extends hs {
	constructor(e) {
		super(e), this.name = "RE2JSGroupException";
	}
}, vs = class extends hs {
	constructor(e) {
		super(e), this.name = "RE2JSFlagsException";
	}
}, ys = class extends hs {
	constructor(e) {
		super(e), this.name = "RE2JSInternalException";
	}
}, bs = class e {
	static MAX_REPLACER_ARGS = 65535;
	static quoteReplacement(e, t = !1) {
		return t ? e.indexOf("\\") < 0 && e.indexOf("$") < 0 ? e : e.split("").map((e) => {
			let t = e.codePointAt(0);
			return t === w.CODES.get("\\") || t === w.CODES.get("$") ? `\\${e}` : e;
		}).join("") : e.indexOf("$") < 0 ? e : e.split("").map((e) => e.codePointAt(0) === w.CODES.get("$") ? "$$" : e).join("");
	}
	constructor(e, t) {
		if (e === null) throw Error("pattern is null");
		this.patternInput = e;
		let n = this.patternInput.re2();
		this.patternGroupCount = n.numberOfCapturingGroups(), this.groups = [], this.namedGroups = n.namedGroups, this.numberOfInstructions = n.numberOfInstructions(), t instanceof cs ? this.resetMatcherInput(t) : O.isByteArray(t) ? this.resetMatcherInput(ds.utf8(t)) : this.resetMatcherInput(ds.utf16(t));
	}
	pattern() {
		return this.patternInput;
	}
	reset() {
		return this.matcherInputLength = this.matcherInput.length(), this.appendPos = 0, this.hasMatch = !1, this.hasGroups = !1, this.anchorFlag = 0, this;
	}
	resetMatcherInput(e) {
		if (e === null) throw Error("input is null");
		return e instanceof cs || (e = O.isByteArray(e) ? ds.utf8(e) : ds.utf16(e)), this.matcherInput = e, this.reset(), this;
	}
	start(e = 0) {
		if (typeof e == "string") {
			let t = this.namedGroups[e];
			if (!Number.isFinite(t)) throw new _s(`group '${e}' not found`);
			e = t;
		}
		return this.loadGroup(e), this.groups[2 * e];
	}
	end(e = 0) {
		if (typeof e == "string") {
			let t = this.namedGroups[e];
			if (!Number.isFinite(t)) throw new _s(`group '${e}' not found`);
			e = t;
		}
		return this.loadGroup(e), this.groups[2 * e + 1];
	}
	programSize() {
		return this.numberOfInstructions;
	}
	group(e = 0) {
		if (typeof e == "string") {
			let t = this.namedGroups[e];
			if (!Number.isFinite(t)) throw new _s(`group '${e}' not found`);
			e = t;
		}
		let t = this.start(e), n = this.end(e);
		return t < 0 && n < 0 ? null : this.substring(t, n);
	}
	getNamedGroups() {
		if (!this.hasMatch) throw new _s("perhaps no match attempted");
		let e = Object.create(null);
		for (let t of Object.keys(this.namedGroups)) e[t] = this.group(t);
		return e;
	}
	groupCount() {
		return this.patternGroupCount;
	}
	loadGroup(e) {
		if (e < 0 || e > this.patternGroupCount) throw new _s(`Group index out of bounds: ${e}`);
		if (!this.hasMatch) throw new _s("perhaps no match attempted");
		if (e === 0 || this.hasGroups) return;
		let t = this.matcherInputLength, n = this.patternInput.re2().matchMachineInput(this.matcherInput, this.groups[0], t, this.anchorFlag, 1 + this.patternGroupCount);
		if (!n[0]) throw new _s("inconsistency in matching group data");
		this.groups = n[1], this.hasGroups = !0;
	}
	matches() {
		return this.genMatch(0, C.ANCHOR_BOTH);
	}
	lookingAt() {
		return this.genMatch(0, C.ANCHOR_START);
	}
	find(e = null) {
		if (e !== null) {
			if (e < 0 || e > this.matcherInputLength) throw new _s(`start index out of bounds: ${e}`);
			return this.reset(), this.genMatch(e, 0);
		}
		if (e = 0, this.hasMatch && (e = this.groups[1], this.groups[0] === this.groups[1])) {
			let t = (this.matcherInput.isUTF16Encoding() ? k.fromUTF16(this.matcherInput.asCharSequence(), 0, this.matcherInputLength) : k.fromUTF8(this.matcherInput.asBytes(), 0, this.matcherInputLength)).step(e);
			t < 0 ? e++ : e += t & 7;
		}
		return this.genMatch(e, C.UNANCHORED);
	}
	genMatch(e, t) {
		let n = this.patternInput.re2().matchMachineInput(this.matcherInput, e, this.matcherInputLength, t, 1);
		return n[0] ? (this.groups = n[1], this.hasMatch = !0, this.hasGroups = this.patternGroupCount === 0, this.anchorFlag = t, !0) : (this.hasMatch = !1, !1);
	}
	substring(e, t) {
		return this.matcherInput.isUTF8Encoding() ? O.utf8ByteArrayToString(this.matcherInput.asBytes().slice(e, t)) : this.matcherInput.asCharSequence().substring(e, t).toString();
	}
	inputLength() {
		return this.matcherInputLength;
	}
	appendReplacement(e, t = !1) {
		let n = "", r = this.start(), i = this.end();
		return this.appendPos < r && (n += this.substring(this.appendPos, r)), this.appendPos = i, n += t ? this.appendReplacementInternalJava(e) : this.appendReplacementInternalJs(e), n;
	}
	appendReplacementInternalJava(e) {
		let t = "", n = 0, r = e.length, i = 0;
		for (; i < r;) {
			let a = e.codePointAt(i);
			if (a === w.CODES.get("\\")) {
				if (n < i && (t += e.substring(n, i)), i++, i >= r) throw new _s("character to be escaped is missing");
				n = i, i++;
				continue;
			}
			if (a === w.CODES.get("$")) {
				if (n < i && (t += e.substring(n, i)), i + 1 >= r) throw new _s("Illegal group reference: group index is missing");
				let a = e.codePointAt(i + 1);
				if (w.CODES.get("0") <= a && a <= w.CODES.get("9")) {
					let o = a - w.CODES.get("0"), s = i + 2;
					for (; s < r; s++) {
						let t = e.codePointAt(s);
						if (t < w.CODES.get("0") || t > w.CODES.get("9") || o * 10 + t - w.CODES.get("0") > this.patternGroupCount) break;
						o = o * 10 + t - w.CODES.get("0");
					}
					if (o > this.patternGroupCount) throw new _s(`n > number of groups: ${o}`);
					let c = this.group(o);
					c !== null && (t += c), i = s, n = i;
				} else if (a === w.CODES.get("{")) {
					let a = i + 2;
					for (; a < r && e.codePointAt(a) !== w.CODES.get("}");) a++;
					if (a >= r) throw new _s("named capture group is missing trailing '}'");
					let o = e.substring(i + 2, a), s = this.group(o);
					s !== null && (t += s), i = a + 1, n = i;
				} else throw new _s("Illegal group reference");
				continue;
			}
			i++;
		}
		return n < r && (t += e.substring(n, r)), t;
	}
	appendReplacementInternalJs(e) {
		let t = "", n = 0, r = e.length;
		for (let i = 0; i < r - 1; i++) if (e.codePointAt(i) === w.CODES.get("$")) {
			let a = e.codePointAt(i + 1);
			if (w.CODES.get("$") === a) {
				n < i && (t += e.substring(n, i)), t += "$", i++, n = i + 1;
				continue;
			}
			if (w.CODES.get("&") === a) {
				n < i && (t += e.substring(n, i));
				let r = this.group(0);
				t += r === null ? "$&" : r, i++, n = i + 1;
				continue;
			}
			if (w.CODES.get("`") === a) {
				n < i && (t += e.substring(n, i)), t += this.substring(0, this.start(0)), i++, n = i + 1;
				continue;
			}
			if (w.CODES.get("'") === a) {
				n < i && (t += e.substring(n, i)), t += this.substring(this.end(0), this.matcherInputLength), i++, n = i + 1;
				continue;
			}
			if (w.CODES.get("1") <= a && a <= w.CODES.get("9")) {
				let o = a - w.CODES.get("0");
				for (n < i && (t += e.substring(n, i)), i += 2; i < r && (a = e.codePointAt(i), !(a < w.CODES.get("0") || a > w.CODES.get("9") || o * 10 + a - w.CODES.get("0") > this.patternGroupCount)); i++) o = o * 10 + a - w.CODES.get("0");
				if (o > this.patternGroupCount) {
					t += `$${o}`, n = i, i--;
					continue;
				}
				let s = this.group(o);
				s !== null && (t += s), n = i, i--;
				continue;
			}
			if (a === w.CODES.get("<")) {
				n < i && (t += e.substring(n, i)), i++;
				let r = i + 1;
				for (; r < e.length && e.codePointAt(r) !== w.CODES.get(">") && e.codePointAt(r) !== w.CODES.get(" ");) r++;
				if (r === e.length || e.codePointAt(r) !== w.CODES.get(">")) {
					t += e.substring(i - 1, r + 1), n = r + 1, i = r;
					continue;
				}
				let a = e.substring(i + 1, r);
				if (Object.prototype.hasOwnProperty.call(this.namedGroups, a)) {
					let e = this.group(a);
					e !== null && (t += e);
				} else t += `$<${a}>`;
				n = r + 1, i = r;
				continue;
			}
		}
		return n < r && (t += e.substring(n, r)), t;
	}
	appendTail() {
		return this.substring(this.appendPos, this.matcherInputLength);
	}
	replaceAll(e, t = !1) {
		return this.replace(e, !0, t);
	}
	replaceFirst(e, t = !1) {
		return this.replace(e, !1, t);
	}
	replace(t, n = !0, r = !1) {
		let i = "";
		this.reset();
		let a = typeof t == "function", o = Object.keys(this.namedGroups).length > 0, s = null;
		if (a) {
			if (this.groupCount() >= e.MAX_REPLACER_ARGS) throw new _s("Too many capture groups to safely invoke replacer function");
			s = this.matcherInput.isUTF8Encoding() ? this.matcherInput.asBytes() : this.matcherInput.asCharSequence();
		}
		for (; this.find() && (i += a ? this.appendReplacementFunc(t, o, s) : this.appendReplacement(t, r), n););
		return i += this.appendTail(), i;
	}
	appendReplacementFunc(e, t, n) {
		let r = "", i = this.start(), a = this.end();
		this.appendPos < i && (r += this.substring(this.appendPos, i)), this.appendPos = a;
		let o = this.buildReplacerArgs(i, t, n);
		return r += String(e(...o)), r;
	}
	buildReplacerArgs(e, t, n) {
		let r = [this.group(0)], i = this.groupCount();
		for (let e = 1; e <= i; e++) {
			let t = this.start(e);
			t < 0 ? r.push(void 0) : r.push(this.substring(t, this.end(e)));
		}
		if (r.push(e), r.push(n), t) {
			let e = this.getNamedGroups();
			for (let t in e) e[t] === null && (e[t] = void 0);
			r.push(e);
		}
		return r;
	}
}, j = class e {
	static ALT = 1;
	static ALT_MATCH = 2;
	static CAPTURE = 3;
	static EMPTY_WIDTH = 4;
	static FAIL = 5;
	static MATCH = 6;
	static NOP = 7;
	static RUNE = 8;
	static RUNE1 = 9;
	static RUNE_ANY = 10;
	static RUNE_ANY_NOT_NL = 11;
	static LB_WRITE = 12;
	static LB_CHECK = 13;
	static isRuneOp(t) {
		return e.RUNE <= t && t <= e.RUNE_ANY_NOT_NL;
	}
	static escapeRunes(e) {
		let t = "\"";
		for (let n of e) t += O.escapeRune(n);
		return t += "\"", t;
	}
	constructor(e) {
		this.op = e, this.out = 0, this.arg = 0, this.runes = [], this.next = null;
	}
	matchRune(e) {
		if (this.runes.length === 1) {
			let t = this.runes[0];
			return (this.arg & C.FOLD_CASE) === 0 ? e === t : D.equalsIgnoreCase(t, e);
		}
		let t = this.runes.length;
		if (t === 0) return !1;
		if (t === 2 || t === 4 || t === 6 || t === 8) {
			for (let n = 0; n < t; n += 2) {
				if (e < this.runes[n]) return !1;
				if (e <= this.runes[n + 1]) return !0;
			}
			return !1;
		}
		let n = 0, r = t >> 1;
		for (; r > 1;) {
			let t = r >> 1;
			n += this.runes[n + t << 1] <= e ? t : 0, r -= t;
		}
		n += +(this.runes[n << 1] <= e);
		let i = n - 1;
		return i >= 0 && e <= this.runes[i << 1 | 1];
	}
	matchRunePos(e) {
		if (this.runes.length === 1) {
			let t = this.runes[0];
			return (this.arg & C.FOLD_CASE) === 0 ? e === t ? 0 : -1 : D.equalsIgnoreCase(t, e) ? 0 : -1;
		}
		let t = this.runes.length;
		if (t === 0) return -1;
		if (t === 2 || t === 4 || t === 6 || t === 8) {
			for (let n = 0; n < t; n += 2) {
				if (e < this.runes[n]) return -1;
				if (e <= this.runes[n + 1]) return Math.floor(n / 2);
			}
			return -1;
		}
		let n = 0, r = t >> 1;
		for (; r > 1;) {
			let t = r >> 1;
			n += this.runes[n + t << 1] <= e ? t : 0, r -= t;
		}
		n += +(this.runes[n << 1] <= e);
		let i = n - 1;
		return i >= 0 && e <= this.runes[i << 1 | 1] ? i : -1;
	}
	toString() {
		switch (this.op) {
			case e.ALT: return `alt -> ${this.out}, ${this.arg}`;
			case e.ALT_MATCH: return `altmatch -> ${this.out}, ${this.arg}`;
			case e.CAPTURE: return `cap ${this.arg} -> ${this.out}`;
			case e.EMPTY_WIDTH: return `empty ${this.arg} -> ${this.out}`;
			case e.MATCH: return `match${this.arg === 0 ? "" : ` ${this.arg}`}`;
			case e.FAIL: return "fail";
			case e.NOP: return `nop -> ${this.out}`;
			case e.LB_WRITE: return `lbwrite ${this.arg} -> ${this.out}`;
			case e.LB_CHECK: return `lbcheck ${this.arg} -> ${this.out}`;
			case e.RUNE: return this.runes === null ? "rune <null>" : [
				"rune ",
				e.escapeRunes(this.runes),
				(this.arg & C.FOLD_CASE) === 0 ? "" : "/i",
				" -> ",
				this.out
			].join("");
			case e.RUNE1: return `rune1 ${e.escapeRunes(this.runes)} -> ${this.out}`;
			case e.RUNE_ANY: return `any -> ${this.out}`;
			case e.RUNE_ANY_NOT_NL: return `anynotnl -> ${this.out}`;
			default: throw Error("unhandled case in Inst.toString");
		}
	}
}, xs = class {
	constructor(e) {
		this.sparse = new Int32Array(e), this.densePcs = new Int32Array(e), this.denseCaps = null, this.size = 0, this.ncap = 0;
	}
	init(e) {
		this.ncap = e;
		let t = this.densePcs.length * e;
		(!this.denseCaps || this.denseCaps.length < t) && (this.denseCaps = new Int32Array(t));
	}
	contains(e) {
		let t = this.sparse[e];
		return t < this.size && this.densePcs[t] === e;
	}
	isEmpty() {
		return this.size === 0;
	}
	add(e) {
		let t = this.size++;
		return this.sparse[e] = t, this.densePcs[t] = e, t;
	}
	clear() {
		this.size = 0;
	}
	toString() {
		let e = "{";
		for (let t = 0; t < this.size; t++) t !== 0 && (e += ", "), e += this.densePcs[t];
		return e += "}", e;
	}
}, Ss = class e {
	static fromRE2(t) {
		let n = new e();
		return n.prog = t.prog, n.re2 = t, n.q0 = new xs(n.prog.numInst()), n.q1 = new xs(n.prog.numInst()), n.matched = !1, n.matchcap = new Int32Array(n.prog.numCap < 2 ? 2 : n.prog.numCap), n.ncap = 0, n;
	}
	static fromMachine(t) {
		return e.fromRE2(t.re2);
	}
	constructor() {
		this.prog = null, this.re2 = null, this.q0 = null, this.q1 = null, this.matched = !1, this.matchcap = null, this.ncap = 0, this.lbTable = null;
	}
	init(e) {
		this.ncap = e, e > this.matchcap.length ? this.matchcap = new Int32Array(e).fill(-1) : this.matchcap.fill(-1), this.q0.init(e), this.q1.init(e), this.prog.numLb > 0 && ((!this.lbTable || this.lbTable.length < this.prog.numLb + 1) && (this.lbTable = new Int32Array(this.prog.numLb + 1)), this.lbTable.fill(-1));
	}
	submatches() {
		return this.ncap === 0 ? O.emptyInts() : O.toArray(this.matchcap.subarray(0, this.ncap));
	}
	match(e, t, n) {
		let r = this.re2.cond;
		if (r === O.EMPTY_ALL || (n === C.ANCHOR_START || n === C.ANCHOR_BOTH) && t !== 0) return !1;
		this.matched = !1, this.matchcap.fill(-1);
		let i = this.prog.numLb > 0 ? 0 : t, a = t, o = this.q0, s = this.q1, c = e.step(i), l = c >> 3, u = c & 7, d = -1, f = 0;
		c !== fs.EOF() && (c = e.step(i + u), d = c >> 3, f = c & 7);
		let p;
		for (p = i === 0 ? O.emptyOpContext(-1, l) : e.context(i);;) {
			if (o.isEmpty()) {
				if ((r & O.EMPTY_BEGIN_TEXT) !== 0 && i !== 0 || (n === C.ANCHOR_START || n === C.ANCHOR_BOTH) && i !== 0 || this.matched) break;
				if (this.prog.numLb === 0 && this.re2.prefix.length !== 0 && d !== this.re2.prefixRune && e.canCheckPrefix()) {
					let t = e.index(this.re2, i);
					if (t < 0) break;
					i += t, c = e.step(i), l = c >> 3, u = c & 7, c = e.step(i + u), d = c >> 3, f = c & 7, p = e.context(i);
				}
			}
			if (i === 0 && this.prog.numLb > 0) for (let e = 0; e < this.prog.lbStarts.length; e++) this.add(o, this.prog.lbStarts[e], i, this.matchcap, 0, p);
			!this.matched && (i === 0 || n === C.UNANCHORED) && i >= a && (this.ncap > 0 && (this.matchcap[0] = i), this.add(o, this.prog.start, i, this.matchcap, 0, p));
			let t = i + u;
			if (p = e.context(t), this.step(o, s, i, t, l, p, n, i === e.endPos()), u === 0 || this.ncap === 0 && this.matched) break;
			i += u, l = d, u = f, l !== -1 && (c = e.step(i + u), d = c >> 3, f = c & 7);
			let m = o;
			o = s, s = m;
		}
		return s.clear(), this.matched;
	}
	matchSet(e, t, n) {
		let r = this.re2.cond;
		if (r === O.EMPTY_ALL || (n === C.ANCHOR_START || n === C.ANCHOR_BOTH) && t !== 0) return [];
		let i = this.prog.numLb > 0 ? 0 : t, a = t, o = this.q0, s = this.q1, c = e.step(i), l = c >> 3, u = c & 7, d = -1, f = 0;
		c !== fs.EOF() && (c = e.step(i + u), d = c >> 3, f = c & 7);
		let p = i === 0 ? O.emptyOpContext(-1, l) : e.context(i), m = /* @__PURE__ */ new Set();
		for (; !(o.isEmpty() && ((r & O.EMPTY_BEGIN_TEXT) !== 0 && i !== 0 || (n === C.ANCHOR_START || n === C.ANCHOR_BOTH) && i !== 0));) {
			if (i === 0 && this.prog.numLb > 0) for (let e = 0; e < this.prog.lbStarts.length; e++) this.add(o, this.prog.lbStarts[e], i, this.matchcap, 0, p);
			(i === 0 || n === C.UNANCHORED) && i >= a && this.add(o, this.prog.start, i, this.matchcap, 0, p);
			let t = i + u;
			p = e.context(t);
			for (let r = 0; r < o.size; r++) {
				let a = o.densePcs[r], c = this.prog.inst[a], u = r * this.ncap, d = !1;
				switch (c.op) {
					case j.MATCH:
						if (n === C.ANCHOR_BOTH && i !== e.endPos()) break;
						m.add(c.arg);
						break;
					case j.RUNE:
						d = c.matchRune(l);
						break;
					case j.RUNE1:
						d = l === c.runes[0];
						break;
					case j.RUNE_ANY:
						d = !0;
						break;
					case j.RUNE_ANY_NOT_NL:
						d = l !== 10;
						break;
					default: continue;
				}
				d && this.add(s, c.out, t, o.denseCaps, u, p);
			}
			if (o.clear(), u === 0) break;
			i += u, l = d, u = f, l !== -1 && (c = e.step(i + u), d = c >> 3, f = c & 7);
			let r = o;
			o = s, s = r;
		}
		return s.clear(), Array.from(m).sort((e, t) => e - t);
	}
	step(e, t, n, r, i, a, o, s) {
		let c = this.re2.longest;
		for (let l = 0; l < e.size; l++) {
			let u = e.densePcs[l], d = l * this.ncap;
			if (c && this.matched && this.ncap > 0 && this.matchcap[0] < e.denseCaps[d]) continue;
			let f = this.prog.inst[u], p = !1;
			switch (f.op) {
				case j.MATCH:
					if (o === C.ANCHOR_BOTH && !s) break;
					if (this.ncap > 0 && (!c || !this.matched || this.matchcap[1] < n)) {
						e.denseCaps[d + 1] = n;
						for (let t = 0; t < this.ncap; t++) this.matchcap[t] = e.denseCaps[d + t];
					}
					c || (e.size = 0), this.matched = !0;
					break;
				case j.RUNE:
					p = f.matchRune(i);
					break;
				case j.RUNE1:
					p = i === f.runes[0];
					break;
				case j.RUNE_ANY:
					p = !0;
					break;
				case j.RUNE_ANY_NOT_NL:
					p = i !== 10;
					break;
				default: continue;
			}
			p && this.add(t, f.out, r, e.denseCaps, d, a);
		}
		e.clear();
	}
	add(e, t, n, r, i, a) {
		for (;;) {
			if (t === 0 || e.contains(t)) return;
			let o = e.add(t), s = this.prog.inst[t];
			switch (s.op) {
				case j.FAIL: return;
				case j.ALT:
				case j.ALT_MATCH:
					this.add(e, s.out, n, r, i, a), t = s.arg;
					continue;
				case j.EMPTY_WIDTH:
					if ((s.arg & ~a) === 0) {
						t = s.out;
						continue;
					}
					return;
				case j.NOP:
					t = s.out;
					continue;
				case j.CAPTURE:
					if (s.arg < this.ncap) {
						let t = r[i + s.arg];
						r[i + s.arg] = n, this.add(e, s.out, n, r, i, a), r[i + s.arg] = t;
						return;
					}
					t = s.out;
					continue;
				case j.LB_WRITE:
					this.lbTable[Math.abs(s.arg)] = n, t = s.out;
					continue;
				case j.LB_CHECK:
					if (s.arg > 0) {
						if (this.lbTable[s.arg] === n) {
							t = s.out;
							continue;
						}
					} else if (this.lbTable[-s.arg] !== n) {
						t = s.out;
						continue;
					}
					return;
				case j.MATCH:
				case j.RUNE:
				case j.RUNE1:
				case j.RUNE_ANY:
				case j.RUNE_ANY_NOT_NL:
					if (this.ncap > 0) {
						let t = o * this.ncap;
						for (let n = 0; n < this.ncap; n++) e.denseCaps[t + n] = r[i + n];
					}
					return;
				default: throw new ys("unhandled");
			}
		}
	}
}, Cs = (e) => {
	let t = -2128831035;
	for (let n = 0; n < e.length; n++) t ^= e[n], t = Math.imul(t, 16777619);
	return t;
}, ws = (e, t) => {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
	return !0;
}, Ts = class {
	constructor(e, t, n = []) {
		this.nfaStates = e, this.isMatch = t, this.matchIDs = n, this.nextLatin1 = Array(D.MAX_LATIN1 + 1).fill(null), this.nextLatin1Anchored = Array(D.MAX_LATIN1 + 1).fill(null), this.transKeys = [], this.transVals = [], this.lastSeen = 0;
	}
}, Es = class e {
	static MAX_CACHE_CLEARS = 5;
	static STATE_MEMORY_ESTIMATE = 838;
	constructor(t, n = 8388608) {
		this.prog = t, this.stateCache = /* @__PURE__ */ new Map(), this.stateCount = 0, this.startState = null, this.stateLimit = Math.max(1, Math.floor(n / e.STATE_MEMORY_ESTIMATE)), this.cacheClears = 0, this.failed = !1, this.clock = 0;
	}
	computeClosure(e) {
		let t = /* @__PURE__ */ new Set(), n = [...e], r = !1, i = [];
		for (; n.length > 0;) {
			let e = n.pop();
			if (t.has(e)) continue;
			t.add(e);
			let a = this.prog.getInst(e);
			switch (a.op) {
				case j.MATCH:
					r = !0, i.includes(a.arg) || i.push(a.arg);
					break;
				case j.ALT:
				case j.ALT_MATCH:
					n.push(a.out), n.push(a.arg);
					break;
				case j.NOP:
				case j.CAPTURE:
					n.push(a.out);
					break;
				case j.EMPTY_WIDTH:
				case j.LB_WRITE:
				case j.LB_CHECK: return null;
			}
		}
		let a = Int32Array.from(t).sort();
		return i.sort((e, t) => e - t), {
			pcs: a,
			isMatch: r,
			matchIDs: i
		};
	}
	getState(t) {
		let n = this.computeClosure(t);
		if (!n) return null;
		let r = n.pcs, i = Cs(r), a = this.stateCache.get(i);
		if (a) for (let e = 0; e < a.length; e++) {
			let t = a[e];
			if (ws(t.nfaStates, r)) return t.lastSeen = ++this.clock, t;
		}
		else a = [], this.stateCache.set(i, a);
		if (this.failed) return null;
		if (this.stateCount >= this.stateLimit) {
			if (this.cacheClears++, this.cacheClears >= e.MAX_CACHE_CLEARS) return this.failed = !0, this.stateCache.clear(), this.stateCount = 0, this.startState = null, null;
			this.evictCache(), a = this.stateCache.get(i), a || (a = [], this.stateCache.set(i, a));
		}
		let o = new Ts(r, n.isMatch, n.matchIDs);
		return o.lastSeen = ++this.clock, a.push(o), this.stateCount++, o;
	}
	evictCache() {
		let e = [];
		for (let t of this.stateCache.values()) for (let n = 0; n < t.length; n++) e.push(t[n]);
		e.sort((e, t) => e.lastSeen - t.lastSeen);
		let t = Math.max(1, Math.floor(this.stateLimit / 2)), n = e.length - t, r = e.slice(n), i = new Set(r);
		this.stateCache.clear(), this.stateCount = 0;
		for (let e = 0; e < r.length; e++) {
			let t = r[e];
			t.nextLatin1.fill(null), t.nextLatin1Anchored.fill(null), t.transKeys.length = 0, t.transVals.length = 0;
			let n = Cs(t.nfaStates), i = this.stateCache.get(n);
			i || (i = [], this.stateCache.set(n, i)), i.push(t), this.stateCount++;
		}
		this.startState && !i.has(this.startState) && (this.startState = null);
	}
	step(e, t, n) {
		if (t <= D.MAX_LATIN1) {
			if (n === C.UNANCHORED) {
				let n = e.nextLatin1[t];
				if (n !== null) return n;
			} else {
				let n = e.nextLatin1Anchored[t];
				if (n !== null) return n;
			}
		} else {
			let r = t + (n === C.UNANCHORED ? 0 : D.MAX_RUNE + 1), i = e.transKeys, a = i.length;
			for (let t = 0; t < a; t++) if (i[t] === r) return e.transVals[t];
		}
		let r = [];
		for (let n = 0; n < e.nfaStates.length; n++) {
			let i = e.nfaStates[n], a = this.prog.getInst(i);
			j.isRuneOp(a.op) && a.matchRune(t) && r.push(a.out);
		}
		n === C.UNANCHORED && r.push(this.prog.start);
		let i = this.getState(r);
		if (t <= D.MAX_LATIN1) n === C.UNANCHORED ? e.nextLatin1[t] = i : e.nextLatin1Anchored[t] = i;
		else {
			let r = t + (n === C.UNANCHORED ? 0 : D.MAX_RUNE + 1);
			e.transKeys.push(r), e.transVals.push(i);
		}
		return i;
	}
	match(e, t, n) {
		if ((n === C.ANCHOR_START || n === C.ANCHOR_BOTH) && t !== 0) return !1;
		if (!this.startState && (this.startState = this.getState([this.prog.start]), !this.startState)) return null;
		let r = e.endPos(), i = this.startState;
		if (i.isMatch) {
			if (n === C.ANCHOR_BOTH) {
				if (t === r) return !0;
			} else return !0;
		}
		let a = t;
		for (; a < r;) {
			let t = e.step(a), o = t >> 3, s = t & 7;
			if (s === 0) break;
			if (i = n === C.UNANCHORED && o <= D.MAX_LATIN1 && i.nextLatin1[o] || this.step(i, o, n), i === null) return null;
			if (i.lastSeen = ++this.clock, i.isMatch) {
				if (n === C.ANCHOR_BOTH) {
					if (a + s === r) return !0;
				} else return !0;
			}
			if (i.nfaStates.length === 0 && n !== C.UNANCHORED) return !1;
			a += s;
		}
		return !1;
	}
	matchSet(e, t, n) {
		if ((n === C.ANCHOR_START || n === C.ANCHOR_BOTH) && t !== 0) return [];
		if (!this.startState && (this.startState = this.getState([this.prog.start]), !this.startState)) return null;
		let r = e.endPos(), i = this.startState, a = /* @__PURE__ */ new Set(), o = (e, t) => {
			e.isMatch && (n === C.ANCHOR_BOTH ? t === r && e.matchIDs.forEach((e) => a.add(e)) : e.matchIDs.forEach((e) => a.add(e)));
		};
		o(i, t);
		let s = t;
		for (; s < r;) {
			let t = e.step(s), r = t >> 3, a = t & 7;
			if (a === 0) break;
			if (i = n === C.UNANCHORED && r <= D.MAX_LATIN1 && i.nextLatin1[r] || this.step(i, r, n), i === null) return null;
			if (i.lastSeen = ++this.clock, s += a, o(i, s), i.nfaStates.length === 0 && n !== C.UNANCHORED) break;
		}
		return Array.from(a).sort((e, t) => e - t);
	}
}, Ds = 32, Os = 500, ks = 256, As = 262144, js = class {
	constructor() {
		this.end = 0, this.cap = /* @__PURE__ */ new Int32Array(), this.matchcap = /* @__PURE__ */ new Int32Array(), this.ncap = 0, this.jobPc = new Int32Array(ks), this.jobArg = new Uint8Array(ks), this.jobPos = new Int32Array(ks), this.jobLen = 0, this.visited = /* @__PURE__ */ new Uint32Array();
	}
	reset(e, t, n) {
		this.end = t, this.jobLen = 0, this.ncap = n;
		let r = e.numInst() * (t + 1) + Ds - 1 >>> 5;
		this.visited.length < r ? this.visited = new Uint32Array(r) : this.visited.fill(0, 0, r), this.cap.length < n ? this.cap = new Int32Array(n).fill(-1) : this.cap.fill(-1, 0, n), this.matchcap.length < n ? this.matchcap = new Int32Array(n).fill(-1) : this.matchcap.fill(-1, 0, n);
	}
	shouldVisit(e, t) {
		let n = e * (this.end + 1) + t, r = n >>> 5, i = 1 << (n & 31);
		return (this.visited[r] & i) === 0 && (this.visited[r] |= i, !0);
	}
	push(e, t, n, r) {
		if (e.prog.getInst(t).op !== j.FAIL && (r || this.shouldVisit(t, n))) {
			if (this.jobLen >= this.jobPc.length) {
				let e = this.jobPc.length * 2, t = new Int32Array(e);
				t.set(this.jobPc), this.jobPc = t;
				let n = new Uint8Array(e);
				n.set(this.jobArg), this.jobArg = n;
				let r = new Int32Array(e);
				r.set(this.jobPos), this.jobPos = r;
			}
			this.jobPc[this.jobLen] = t, this.jobArg[this.jobLen] = +!!r, this.jobPos[this.jobLen] = n, this.jobLen++;
		}
	}
	tryBacktrack(e, t, n, r, i) {
		let a = e.longest;
		for (this.push(e, n, r, !1); this.jobLen > 0;) {
			this.jobLen--;
			let n = this.jobPc[this.jobLen], r = this.jobArg[this.jobLen] === 1, o = this.jobPos[this.jobLen], s = !0;
			for (; !(!s && !this.shouldVisit(n, o));) {
				s = !1;
				let c = e.prog.getInst(n);
				switch (c.op) {
					case j.FAIL: throw new ys("unexpected InstFail");
					case j.ALT:
						if (r) {
							r = !1, n = c.arg;
							continue;
						}
						this.push(e, n, o, !0), n = c.out;
						continue;
					case j.ALT_MATCH: {
						let t = e.prog.getInst(c.out);
						if (j.isRuneOp(t.op)) {
							this.push(e, c.arg, o, !1), n = c.arg, o = this.end;
							continue;
						}
						this.push(e, c.out, this.end, !1), n = c.out;
						continue;
					}
					case j.RUNE: {
						let e = t.step(o);
						if (e === fs.EOF() || !c.matchRune(e >> 3)) break;
						o += e & 7, n = c.out;
						continue;
					}
					case j.RUNE1: {
						let e = t.step(o);
						if (e === fs.EOF() || e >> 3 !== c.runes[0]) break;
						o += e & 7, n = c.out;
						continue;
					}
					case j.RUNE_ANY_NOT_NL: {
						let e = t.step(o);
						if (e === fs.EOF() || e >> 3 == 10) break;
						o += e & 7, n = c.out;
						continue;
					}
					case j.RUNE_ANY: {
						let e = t.step(o);
						if (e === fs.EOF()) break;
						o += e & 7, n = c.out;
						continue;
					}
					case j.CAPTURE:
						if (r) {
							this.cap[c.arg] = o;
							break;
						}
						c.arg < this.ncap && (this.push(e, n, this.cap[c.arg], !0), this.cap[c.arg] = o), n = c.out;
						continue;
					case j.EMPTY_WIDTH: {
						let e = t.context(o);
						if ((c.arg & ~e) !== 0) break;
						n = c.out;
						continue;
					}
					case j.NOP:
						n = c.out;
						continue;
					case j.MATCH: {
						if (i === C.ANCHOR_BOTH && o !== this.end) break;
						if (this.ncap === 0) return !0;
						this.ncap > 1 && (this.cap[1] = o);
						let e = this.matchcap[1];
						if ((e === -1 || a && o > 0 && o > e) && this.matchcap.set(this.cap), !a || o === this.end) return !0;
						break;
					}
					case j.LB_WRITE:
					case j.LB_CHECK: throw new ys("Backtracker cannot evaluate Lookbehind instructions");
					default: throw new ys("bad inst");
				}
				break;
			}
		}
		return a && this.matchcap.length > 1 && this.matchcap[1] >= 0;
	}
}, Ms = [], Ns = class e {
	static shouldBacktrack(e) {
		return e.numInst() <= Os;
	}
	static maxBitStateLen(t) {
		return e.shouldBacktrack(t) ? Math.floor(As / t.numInst()) : 0;
	}
	static execute(e, t, n, r, i) {
		let a = e.cond;
		if (a === O.EMPTY_ALL || (r === C.ANCHOR_START || r === C.ANCHOR_BOTH) && n !== 0 || (a & O.EMPTY_BEGIN_TEXT) !== 0 && n !== 0) return null;
		let o = Ms.length > 0 ? Ms.pop() : new js(), s = t.endPos();
		o.reset(e.prog, s, i);
		let c = !1;
		if ((a & O.EMPTY_BEGIN_TEXT) !== 0 || r === C.ANCHOR_START || r === C.ANCHOR_BOTH) o.ncap > 0 && (o.cap[0] = n), o.tryBacktrack(e, t, e.prog.start, n, r) && (c = !0);
		else {
			let i = -1;
			for (; n <= s && i !== 0; n += i) {
				if (e.prefix.length > 0) {
					let r = t.index(e, n);
					if (r < 0) break;
					n += r;
				}
				if (o.ncap > 0 && (o.cap[0] = n), o.tryBacktrack(e, t, e.prog.start, n, r)) {
					c = !0;
					break;
				}
				let a = t.step(n);
				i = a === fs.EOF() ? 0 : a & 7;
			}
		}
		if (!c) return Ms.push(o), null;
		let l = i === 0 ? [] : O.toArray(o.matchcap.subarray(0, i));
		return Ms.push(o), l;
	}
}, Ps = class {
	constructor(e) {
		this.sparse = new Uint32Array(e), this.dense = new Uint32Array(e), this.size = 0, this.nextIndex = 0;
	}
	empty() {
		return this.nextIndex >= this.size;
	}
	next() {
		return this.dense[this.nextIndex++];
	}
	clear() {
		this.size = 0, this.nextIndex = 0;
	}
	contains(e) {
		return e < this.sparse.length && this.sparse[e] < this.size && this.dense[this.sparse[e]] === e;
	}
	insert(e) {
		this.contains(e) || this.insertNew(e);
	}
	insertNew(e) {
		e >= this.sparse.length || (this.sparse[e] = this.size, this.dense[this.size] = e, this.size++);
	}
}, Fs = (e, t, n, r) => {
	let i = e.length, a = t.length, o = 0, s = 0, c = [], l = [], u = !0, d = -1, f = (i) => {
		let a = i ? e : t, u = i ? o : s, f = i ? n : r;
		return d > 0 && a[u] <= c[d] ? !1 : (c.push(a[u], a[u + 1]), i ? o += 2 : s += 2, d += 2, l.push(f), !0);
	};
	for (; o < i || s < a;) if (u = s >= a ? f(!0) : o >= i || t[s] < e[o] ? f(!1) : f(!0), !u) return null;
	return {
		merged: c,
		next: l
	};
}, Is = class {
	constructor(e) {
		this.start = e.start, this.numCap = e.numCap, this.inst = Array(e.inst.length);
		for (let t = 0; t < e.inst.length; t++) {
			let n = e.inst[t], r = new j(n.op);
			r.out = n.out, r.arg = n.arg, r.runes = n.runes ? n.runes.slice() : [], r.next = null, this.inst[t] = r;
		}
	}
}, Ls = (e) => {
	let t = new Is(e);
	for (let e = 0; e < t.inst.length; e++) {
		let n = t.inst[e];
		if (n.op !== j.ALT && n.op !== j.ALT_MATCH) continue;
		let r = "out", i = "arg", a = t.inst[n[i]];
		if (a.op !== j.ALT && a.op !== j.ALT_MATCH && (r = "arg", i = "out", a = t.inst[n[i]], a.op !== j.ALT && a.op !== j.ALT_MATCH)) continue;
		let o = t.inst[n[r]];
		if (o.op === j.ALT || o.op === j.ALT_MATCH) continue;
		let s = "out", c = "arg", l = !1;
		a.out === e ? l = !0 : a.arg === e && (l = !0, s = "arg", c = "out"), l && (a[s] = n[r]), n[r] === a[s] && (n[i] = a[c]);
	}
	return t;
}, Rs = (e) => {
	if (e.inst.length >= 1e3) return null;
	let t = new Ps(e.inst.length), n = new Ps(e.inst.length), r = Array(e.inst.length), i = Array(e.inst.length).fill(!1), a = (o) => {
		let s = !0, c = e.inst[o];
		if (n.contains(o)) return !0;
		switch (n.insert(o), c.op) {
			case j.ALT:
			case j.ALT_MATCH: {
				s = a(c.out) && a(c.arg);
				let e = i[c.out], t = i[c.arg];
				if (e && t) return !1;
				if (t) {
					let n = c.out;
					c.out = c.arg, c.arg = n;
					let r = e;
					e = t, t = r;
				}
				e && (i[o] = !0, c.op = j.ALT_MATCH);
				let n = Fs(r[c.out] || [], r[c.arg] || [], c.out, c.arg);
				if (!n) return !1;
				r[o] = n.merged, c.next = new Uint32Array(n.next);
				break;
			}
			case j.CAPTURE:
			case j.EMPTY_WIDTH:
			case j.NOP:
				s = a(c.out), i[o] = i[c.out], r[o] = r[c.out] ? r[c.out].slice() : [], c.next = new Uint32Array(Math.floor(r[o].length / 2) + 1).fill(c.out);
				break;
			case j.MATCH:
			case j.FAIL:
				i[o] = c.op === j.MATCH;
				break;
			case j.RUNE: {
				if (i[o] = !1, c.next && c.next.length > 0) break;
				if (t.insert(c.out), !c.runes || c.runes.length === 0) {
					r[o] = [], c.next = new Uint32Array([c.out]);
					break;
				}
				let e = [];
				if (c.runes.length === 1 && (c.arg & C.FOLD_CASE) !== 0) {
					let t = c.runes[0];
					e.push(t, t);
					for (let n = D.simpleFold(t); n !== t; n = D.simpleFold(n)) e.push(n, n);
					e.sort((e, t) => e - t);
				} else for (let t = 0; t < c.runes.length; t++) e.push(c.runes[t]);
				r[o] = e, c.next = new Uint32Array(Math.floor(e.length / 2) + 1).fill(c.out), c.op = j.RUNE;
				break;
			}
			case j.RUNE1: {
				if (i[o] = !1, c.next && c.next.length > 0) break;
				t.insert(c.out);
				let e = [];
				if ((c.arg & C.FOLD_CASE) !== 0) {
					let t = c.runes[0];
					e.push(t, t);
					for (let n = D.simpleFold(t); n !== t; n = D.simpleFold(n)) e.push(n, n);
					e.sort((e, t) => e - t);
				} else e.push(c.runes[0], c.runes[0]);
				r[o] = e, c.next = new Uint32Array(Math.floor(e.length / 2) + 1).fill(c.out), c.op = j.RUNE;
				break;
			}
			case j.RUNE_ANY:
				if (i[o] = !1, c.next && c.next.length > 0) break;
				t.insert(c.out), r[o] = [0, D.MAX_RUNE], c.next = new Uint32Array([c.out]);
				break;
			case j.RUNE_ANY_NOT_NL:
				if (i[o] = !1, c.next && c.next.length > 0) break;
				t.insert(c.out), r[o] = [
					0,
					9,
					11,
					D.MAX_RUNE
				], c.next = new Uint32Array(Math.floor(r[o].length / 2) + 1).fill(c.out);
		}
		return s;
	};
	for (t.clear(), t.insert(e.start); !t.empty();) if (n.clear(), !a(t.next())) return null;
	for (let t = 0; t < e.inst.length; t++) r[t] && (e.inst[t].runes = r[t]);
	return e;
}, zs = (e, t) => {
	for (let n = 0; n < t.inst.length; n++) {
		let r = t.inst[n];
		switch (r.op) {
			case j.ALT:
			case j.ALT_MATCH:
			case j.RUNE: break;
			case j.CAPTURE:
			case j.EMPTY_WIDTH:
			case j.NOP:
			case j.MATCH:
			case j.FAIL:
				e.inst[n].next = null;
				break;
			case j.RUNE1:
			case j.RUNE_ANY:
			case j.RUNE_ANY_NOT_NL: e.inst[n].next = null, e.inst[n].op = r.op, e.inst[n].runes = r.runes ? r.runes.slice() : [];
		}
	}
}, Bs = class e {
	static compile(e) {
		if (e.start === 0 || e.numLb > 0) return null;
		let t = e.inst[e.start];
		if (t.op !== j.EMPTY_WIDTH || (t.arg & O.EMPTY_BEGIN_TEXT) === 0) return null;
		let n = !1;
		for (let t = 0; t < e.inst.length; t++) if (e.inst[t].op === j.ALT || e.inst[t].op === j.ALT_MATCH) {
			n = !0;
			break;
		}
		for (let t = 0; t < e.inst.length; t++) {
			let r = e.inst[t], i = e.inst[r.out].op;
			switch (r.op) {
				case j.ALT:
				case j.ALT_MATCH:
					if (i === j.MATCH || e.inst[r.arg].op === j.MATCH) return null;
					break;
				case j.EMPTY_WIDTH:
					if (i === j.MATCH) {
						if ((r.arg & O.EMPTY_END_TEXT) === O.EMPTY_END_TEXT) continue;
						return null;
					}
					break;
				default: if (i === j.MATCH && n) return null;
			}
		}
		let r = Ls(e);
		return r = Rs(r), r !== null && zs(r, e), r;
	}
	static next(e, t) {
		let n = e.matchRunePos(t);
		return n >= 0 ? e.next[n] : e.op === j.ALT_MATCH ? e.out : 0;
	}
	static execute(t, n, r, i, a) {
		let o = t.onepass;
		if (!o) return null;
		let s = new Int32Array(a).fill(-1), c = !1, l = n.step(r), u = l >> 3, d = l & 7, f = fs.EOF(), p = -1, m = 0;
		l !== fs.EOF() && (f = n.step(r + d), f !== fs.EOF() && (p = f >> 3, m = f & 7));
		let h = r === 0 ? O.emptyOpContext(-1, u) : n.context(r), g = o.start, _;
		for (;;) {
			switch (_ = o.inst[g], g = _.out, _.op) {
				case j.MATCH: return i === C.ANCHOR_BOTH && r !== n.endPos() ? null : (c = !0, s.length > 0 && (s[0] = 0, s[1] = r), a === 0 ? [] : O.toArray(s));
				case j.RUNE:
					if (!_.matchRune(u)) return null;
					break;
				case j.RUNE1:
					if (u !== _.runes[0]) return null;
					break;
				case j.RUNE_ANY: break;
				case j.RUNE_ANY_NOT_NL:
					if (u === 10) return null;
					break;
				case j.ALT:
				case j.ALT_MATCH:
					g = e.next(_, u);
					continue;
				case j.FAIL: return null;
				case j.NOP: continue;
				case j.EMPTY_WIDTH:
					if ((_.arg & ~h) !== 0) return null;
					continue;
				case j.CAPTURE:
					_.arg < s.length && (s[_.arg] = r);
					continue;
				default: throw new ys("bad inst");
			}
			if (d === 0) break;
			h = O.emptyOpContext(u, p), r += d, u = p, d = m, u !== -1 && (f = n.step(r + d), f === fs.EOF() ? (p = -1, m = 0) : (p = f >> 3, m = f & 7));
		}
		return c ? a === 0 ? [] : O.toArray(s) : null;
	}
}, M = class e {
	static Op = ss([
		"NO_MATCH",
		"EMPTY_MATCH",
		"LITERAL",
		"CHAR_CLASS",
		"ANY_CHAR_NOT_NL",
		"ANY_CHAR",
		"BEGIN_LINE",
		"END_LINE",
		"BEGIN_TEXT",
		"END_TEXT",
		"WORD_BOUNDARY",
		"NO_WORD_BOUNDARY",
		"CAPTURE",
		"STAR",
		"PLUS",
		"QUEST",
		"REPEAT",
		"CONCAT",
		"ALTERNATE",
		"PLB",
		"NLB",
		"LEFT_PAREN",
		"VERTICAL_BAR"
	]);
	static isPseudoOp(t) {
		return t >= e.Op.LEFT_PAREN;
	}
	static emptySubs() {
		return [];
	}
	static quoteIfHyphen(e) {
		return e === w.CODES.get("-") ? "\\" : "";
	}
	static fromRegexp(t) {
		let n = new e(t.op);
		return n.flags = t.flags, n.subs = t.subs, n.runes = t.runes, n.cap = t.cap, n.min = t.min, n.max = t.max, n.name = t.name, n.namedGroups = t.namedGroups, n.lb = t.lb, n;
	}
	constructor(t) {
		this.op = t, this.flags = 0, this.subs = e.emptySubs(), this.runes = [], this.min = 0, this.max = 0, this.cap = 0, this.name = null, this.namedGroups = Object.create(null), this.lb = 0;
	}
	reinit() {
		this.flags = 0, this.subs = e.emptySubs(), this.runes = [], this.cap = 0, this.min = 0, this.max = 0, this.name = null, this.namedGroups = Object.create(null), this.lb = 0;
	}
	toString() {
		return this.appendTo();
	}
	appendTo() {
		let t = "";
		switch (this.op) {
			case e.Op.NO_MATCH:
				t += "[^\\x00-\\x{10FFFF}]";
				break;
			case e.Op.EMPTY_MATCH:
				t += "(?:)";
				break;
			case e.Op.STAR:
			case e.Op.PLUS:
			case e.Op.QUEST:
			case e.Op.REPEAT: {
				let n = this.subs[0];
				switch (n.op > e.Op.CAPTURE || n.op === e.Op.LITERAL && n.runes.length > 1 ? t += `(?:${n.appendTo()})` : t += n.appendTo(), this.op) {
					case e.Op.STAR:
						t += "*";
						break;
					case e.Op.PLUS:
						t += "+";
						break;
					case e.Op.QUEST:
						t += "?";
						break;
					case e.Op.REPEAT: t += `{${this.min}`, this.min !== this.max && (t += ",", this.max >= 0 && (t += this.max)), t += "}";
				}
				(this.flags & C.NON_GREEDY) !== 0 && (t += "?");
				break;
			}
			case e.Op.CONCAT:
				for (let n of this.subs) n.op === e.Op.ALTERNATE ? t += `(?:${n.appendTo()})` : t += n.appendTo();
				break;
			case e.Op.ALTERNATE: {
				let e = "";
				for (let n of this.subs) t += e, e = "|", t += n.appendTo();
				break;
			}
			case e.Op.LITERAL:
				(this.flags & C.FOLD_CASE) !== 0 && (t += "(?i:");
				for (let e of this.runes) t += O.escapeRune(e);
				(this.flags & C.FOLD_CASE) !== 0 && (t += ")");
				break;
			case e.Op.ANY_CHAR_NOT_NL:
				t += "(?-s:.)";
				break;
			case e.Op.ANY_CHAR:
				t += "(?s:.)";
				break;
			case e.Op.PLB:
				t += `(?<=${this.subs[0].appendTo()})`;
				break;
			case e.Op.NLB:
				t += `(?<!${this.subs[0].appendTo()})`;
				break;
			case e.Op.CAPTURE:
				this.name === null || this.name.length === 0 ? t += "(" : t += `(?P<${this.name}>`, this.subs[0].op !== e.Op.EMPTY_MATCH && (t += this.subs[0].appendTo()), t += ")";
				break;
			case e.Op.BEGIN_TEXT:
				t += "\\A";
				break;
			case e.Op.END_TEXT:
				(this.flags & C.WAS_DOLLAR) === 0 ? t += "\\z" : t += "(?-m:$)";
				break;
			case e.Op.BEGIN_LINE:
				t += "^";
				break;
			case e.Op.END_LINE:
				t += "$";
				break;
			case e.Op.WORD_BOUNDARY:
				t += "\\b";
				break;
			case e.Op.NO_WORD_BOUNDARY:
				t += "\\B";
				break;
			case e.Op.CHAR_CLASS:
				if (this.runes.length % 2 != 0) {
					t += "[invalid char class]";
					break;
				}
				if (t += "[", this.runes.length === 0) t += "^\\x00-\\x{10FFFF}";
				else if (this.runes[0] === 0 && this.runes[this.runes.length - 1] === D.MAX_RUNE) {
					t += "^";
					for (let n = 1; n < this.runes.length - 1; n += 2) {
						let r = this.runes[n] + 1, i = this.runes[n + 1] - 1;
						t += e.quoteIfHyphen(r), t += O.escapeRune(r), r !== i && (t += "-", t += e.quoteIfHyphen(i), t += O.escapeRune(i));
					}
				} else for (let n = 0; n < this.runes.length; n += 2) {
					let r = this.runes[n], i = this.runes[n + 1];
					t += e.quoteIfHyphen(r), t += O.escapeRune(r), r !== i && (t += "-", t += e.quoteIfHyphen(i), t += O.escapeRune(i));
				}
				t += "]";
				break;
			default: t += this.op;
		}
		return t;
	}
	maxCap() {
		let t = 0;
		if (this.op === e.Op.CAPTURE && (t = this.cap), this.subs !== null) for (let e of this.subs) {
			let n = e.maxCap();
			t < n && (t = n);
		}
		return t;
	}
	equals(t) {
		if (!(t !== null && t instanceof e) || this.op !== t.op) return !1;
		switch (this.op) {
			case e.Op.END_TEXT:
				if ((this.flags & C.WAS_DOLLAR) !== (t.flags & C.WAS_DOLLAR)) return !1;
				break;
			case e.Op.LITERAL:
			case e.Op.CHAR_CLASS:
				if (this.runes === null && t.runes === null) break;
				if (this.runes === null || t.runes === null || this.runes.length !== t.runes.length) return !1;
				for (let e = 0; e < this.runes.length; e++) if (this.runes[e] !== t.runes[e]) return !1;
				break;
			case e.Op.ALTERNATE:
			case e.Op.CONCAT:
				if (this.subs.length !== t.subs.length) return !1;
				for (let e = 0; e < this.subs.length; ++e) if (!this.subs[e].equals(t.subs[e])) return !1;
				break;
			case e.Op.STAR:
			case e.Op.PLUS:
			case e.Op.QUEST:
				if ((this.flags & C.NON_GREEDY) !== (t.flags & C.NON_GREEDY) || !this.subs[0].equals(t.subs[0])) return !1;
				break;
			case e.Op.REPEAT:
				if ((this.flags & C.NON_GREEDY) !== (t.flags & C.NON_GREEDY) || this.min !== t.min || this.max !== t.max || !this.subs[0].equals(t.subs[0])) return !1;
				break;
			case e.Op.CAPTURE:
				if (this.cap !== t.cap || (this.name === null ? t.name !== null : this.name !== t.name) || !this.subs[0].equals(t.subs[0])) return !1;
				break;
			case e.Op.PLB:
			case e.Op.NLB: if (this.lb !== t.lb || !this.subs[0].equals(t.subs[0])) return !1;
		}
		return !0;
	}
}, Vs = class {
	constructor(e) {
		this.next = [Object.create(null)], this.fail = [0], this.match = [!1];
		for (let t of e) {
			let e = 0;
			for (let n = 0; n < t.length; n++) {
				let r = t[n];
				r in this.next[e] || (this.next.push(Object.create(null)), this.fail.push(0), this.match.push(!1), this.next[e][r] = this.next.length - 1), e = this.next[e][r];
			}
			this.match[e] = !0;
		}
		let t = [];
		for (let e in this.next[0]) if (Object.prototype.hasOwnProperty.call(this.next[0], e)) {
			let n = this.next[0][e];
			this.fail[n] = 0, t.push(n);
		}
		for (; t.length > 0;) {
			let e = t.shift();
			for (let n in this.next[e]) if (Object.prototype.hasOwnProperty.call(this.next[e], n)) {
				let r = this.next[e][n], i = this.fail[e];
				for (; i !== 0 && !(n in this.next[i]);) i = this.fail[i];
				n in this.next[i] ? this.fail[r] = this.next[i][n] : this.fail[r] = 0, this.match[r] = this.match[r] || this.match[this.fail[r]], t.push(r);
			}
		}
	}
	searchUTF16(e, t, n) {
		let r = 0;
		for (let i = t; i < n; i++) {
			let t = e.charCodeAt(i);
			for (; r !== 0 && !(t in this.next[r]);) r = this.fail[r];
			if (t in this.next[r] && (r = this.next[r][t]), this.match[r]) return !0;
		}
		return !1;
	}
	searchUTF8(e, t, n) {
		let r = 0;
		for (let i = t; i < n; i++) {
			let t = e[i];
			for (; r !== 0 && !(t in this.next[r]);) r = this.fail[r];
			if (t in this.next[r] && (r = this.next[r][t]), this.match[r]) return !0;
		}
		return !1;
	}
}, N = class e {
	static Type = {
		NONE: 0,
		EXACT: 1,
		AND: 2,
		OR: 3
	};
	constructor(e) {
		this.type = e, this.subs = [], this.str = "", this.bytes = null, this.ac16 = null, this.ac8 = null;
	}
	eval(t, n) {
		switch (this.type) {
			case e.Type.NONE: return !0;
			case e.Type.EXACT: return t.hasString(this, n);
			case e.Type.AND:
				for (let e = 0; e < this.subs.length; e++) if (!this.subs[e].eval(t, n)) return !1;
				return !0;
			case e.Type.OR:
				if (this.ac16 && this.ac8) return t.hasAnyString(this, n);
				for (let e = 0; e < this.subs.length; e++) if (this.subs[e].eval(t, n)) return !0;
				return !1;
			default: return !0;
		}
	}
}, Hs = class e {
	static build(t) {
		let n = e.fromRegexp(t);
		return e.simplify(n);
	}
	static fromRegexp(t) {
		if (!t) return new N(N.Type.NONE);
		switch (t.op) {
			case M.Op.PLB:
			case M.Op.NLB:
			case M.Op.NO_MATCH:
			case M.Op.EMPTY_MATCH:
			case M.Op.BEGIN_LINE:
			case M.Op.END_LINE:
			case M.Op.BEGIN_TEXT:
			case M.Op.END_TEXT:
			case M.Op.WORD_BOUNDARY:
			case M.Op.NO_WORD_BOUNDARY:
			case M.Op.CHAR_CLASS:
			case M.Op.ANY_CHAR_NOT_NL:
			case M.Op.ANY_CHAR: return new N(N.Type.NONE);
			case M.Op.LITERAL: {
				if (t.runes.length === 0 || (t.flags & C.FOLD_CASE) !== 0) return new N(N.Type.NONE);
				let e = new N(N.Type.EXACT), n = "";
				for (let e = 0; e < t.runes.length; e++) n += String.fromCodePoint(t.runes[e]);
				return e.str = n, e.bytes = O.stringToUtf8ByteArray(e.str), e;
			}
			case M.Op.CAPTURE:
			case M.Op.PLUS: return e.fromRegexp(t.subs[0]);
			case M.Op.REPEAT: return t.min >= 1 ? e.fromRegexp(t.subs[0]) : new N(N.Type.NONE);
			case M.Op.CONCAT: {
				let n = new N(N.Type.AND);
				for (let r of t.subs) n.subs.push(e.fromRegexp(r));
				return n;
			}
			case M.Op.ALTERNATE: {
				let n = new N(N.Type.OR);
				for (let r of t.subs) n.subs.push(e.fromRegexp(r));
				return n;
			}
			default: return new N(N.Type.NONE);
		}
	}
	static simplify(t) {
		if (t.type === N.Type.EXACT || t.type === N.Type.NONE) return t;
		if (t.type === N.Type.AND) {
			let n = [];
			for (let r of t.subs) {
				let t = e.simplify(r);
				if (t.type !== N.Type.NONE) {
					if (t.type === N.Type.AND) for (let e = 0; e < t.subs.length; e++) n.push(t.subs[e]);
					else n.push(t);
				}
			}
			return n.length === 0 ? new N(N.Type.NONE) : n.length === 1 ? n[0] : (t.subs = n, t);
		}
		if (t.type === N.Type.OR) {
			let n = [];
			for (let r of t.subs) {
				let t = e.simplify(r);
				if (t.type === N.Type.NONE) return new N(N.Type.NONE);
				if (t.type === N.Type.OR) for (let e = 0; e < t.subs.length; e++) n.push(t.subs[e]);
				else n.push(t);
			}
			if (n.length === 0) return new N(N.Type.NONE);
			if (n.length === 1) return n[0];
			let r = /* @__PURE__ */ new Set(), i = [];
			for (let e of n) e.type === N.Type.EXACT ? r.has(e.str) || (r.add(e.str), i.push(e)) : i.push(e);
			t.subs = i;
			let a = !0;
			for (let e of i) if (e.type !== N.Type.EXACT) {
				a = !1;
				break;
			}
			return a && i.length > 1 && (t.ac16 = new Vs(i.map((e) => {
				let t = [];
				for (let n = 0; n < e.str.length; n++) t.push(e.str.charCodeAt(n));
				return t;
			})), t.ac8 = new Vs(i.map((e) => e.bytes))), t;
		}
		return t;
	}
}, Us = class {
	constructor(e = 0, t = 0) {
		this.head = e, this.tail = t;
	}
}, Ws = class {
	constructor() {
		this.inst = [], this.start = 0, this.numCap = 2, this.lbStarts = [], this.numLb = 0;
	}
	getInst(e) {
		return this.inst[e];
	}
	numInst() {
		return this.inst.length;
	}
	addInst(e) {
		this.inst.push(new j(e));
	}
	skipNop(e) {
		let t = this.inst[e];
		for (; t.op === j.NOP || t.op === j.CAPTURE;) t = this.inst[e], e = t.out;
		return t;
	}
	prefix() {
		let e = "", t = this.skipNop(this.start);
		if (!j.isRuneOp(t.op) || t.runes.length !== 1) return [t.op === j.MATCH, e];
		for (; j.isRuneOp(t.op) && t.runes.length === 1 && (t.arg & C.FOLD_CASE) === 0;) e += String.fromCodePoint(t.runes[0]), t = this.skipNop(t.out);
		return [t.op === j.MATCH, e];
	}
	startCond() {
		let e = 0, t = this.start;
		loop: for (;;) {
			let n = this.inst[t];
			switch (n.op) {
				case j.EMPTY_WIDTH:
					e |= n.arg;
					break;
				case j.FAIL: return -1;
				case j.CAPTURE:
				case j.NOP: break;
				default: break loop;
			}
			t = n.out;
		}
		return e;
	}
	patch(e, t) {
		let n = e.head;
		for (; n !== 0;) {
			let e = this.inst[n >> 1];
			n & 1 ? (n = e.arg, e.arg = t) : (n = e.out, e.out = t);
		}
	}
	append(e, t) {
		if (e.head === 0) return t;
		if (t.head === 0) return e;
		let n = this.inst[e.tail >> 1];
		return e.tail & 1 ? n.arg = t.head : n.out = t.head, new Us(e.head, t.tail);
	}
	toString() {
		let e = "";
		for (let t = 0; t < this.inst.length; t++) {
			let n = e.length;
			e += t, t === this.start && (e += "*"), e += "        ".substring(e.length - n), e += this.inst[t], e += "\n";
		}
		return e;
	}
}, Gs = class {
	constructor(e = 0, t = new Us(), n = !1) {
		this.i = e, this.out = t, this.nullable = n;
	}
}, Ks = class e {
	static ANY_RUNE_NOT_NL() {
		return [
			0,
			w.CODES.get("\n") - 1,
			w.CODES.get("\n") + 1,
			D.MAX_RUNE
		];
	}
	static ANY_RUNE() {
		return [0, D.MAX_RUNE];
	}
	static compileRegexp(t) {
		let n = new e(), r = n.compile(t);
		return n.prog.patch(r.out, n.newInst(j.MATCH).i), n.prog.start = r.i, n.prog;
	}
	static compileSet(t) {
		let n = new e();
		if (t.length === 0) return n.prog.start = n.newInst(j.FAIL).i, n.prog;
		let r = [];
		for (let e = 0; e < t.length; e++) {
			let i = n.compile(t[e]), a = n.newInst(j.MATCH);
			n.prog.getInst(a.i).arg = e, n.prog.patch(i.out, a.i), r.push(i.i);
		}
		let i = r[0];
		for (let e = 1; e < r.length; e++) {
			let t = n.newInst(j.ALT), a = n.prog.getInst(t.i);
			a.out = i, a.arg = r[e], i = t.i;
		}
		return n.prog.start = i, n.prog;
	}
	constructor() {
		this.prog = new Ws(), this.newInst(j.FAIL);
	}
	newInst(e) {
		return this.prog.addInst(e), new Gs(this.prog.numInst() - 1, new Us(), !0);
	}
	nop() {
		let e = this.newInst(j.NOP);
		return e.out = new Us(e.i << 1, e.i << 1), e;
	}
	fail() {
		return new Gs();
	}
	cap(e) {
		let t = this.newInst(j.CAPTURE);
		return t.out = new Us(t.i << 1, t.i << 1), this.prog.getInst(t.i).arg = e, this.prog.numCap < e + 1 && (this.prog.numCap = e + 1), t;
	}
	cat(e, t) {
		return e.i === 0 || t.i === 0 ? this.fail() : (this.prog.patch(e.out, t.i), new Gs(e.i, t.out, e.nullable && t.nullable));
	}
	alt(e, t) {
		if (e.i === 0) return t;
		if (t.i === 0) return e;
		let n = this.newInst(j.ALT), r = this.prog.getInst(n.i);
		return r.out = e.i, r.arg = t.i, n.out = this.prog.append(e.out, t.out), n.nullable = e.nullable || t.nullable, n;
	}
	loop(e, t) {
		let n = this.newInst(j.ALT), r = this.prog.getInst(n.i);
		return t ? (r.arg = e.i, n.out = new Us(n.i << 1, n.i << 1)) : (r.out = e.i, n.out = new Us(n.i << 1 | 1, n.i << 1 | 1)), this.prog.patch(e.out, n.i), n;
	}
	quest(e, t) {
		let n = this.newInst(j.ALT), r = this.prog.getInst(n.i);
		return t ? (r.arg = e.i, n.out = new Us(n.i << 1, n.i << 1)) : (r.out = e.i, n.out = new Us(n.i << 1 | 1, n.i << 1 | 1)), n.out = this.prog.append(n.out, e.out), n;
	}
	star(e, t) {
		return e.nullable ? this.quest(this.plus(e, t), t) : this.loop(e, t);
	}
	plus(e, t) {
		return new Gs(e.i, this.loop(e, t).out, e.nullable);
	}
	empty(e) {
		let t = this.newInst(j.EMPTY_WIDTH);
		return this.prog.getInst(t.i).arg = e, t.out = new Us(t.i << 1, t.i << 1), t;
	}
	rune(e, t) {
		let n = this.newInst(j.RUNE);
		n.nullable = !1;
		let r = this.prog.getInst(n.i);
		return r.runes = e, t &= C.FOLD_CASE, (e.length !== 1 || D.simpleFold(e[0]) === e[0]) && (t &= ~C.FOLD_CASE), r.arg = t, n.out = new Us(n.i << 1, n.i << 1), (t & C.FOLD_CASE) === 0 && e.length === 1 || e.length === 2 && e[0] === e[1] ? r.op = j.RUNE1 : e.length === 2 && e[0] === 0 && e[1] === D.MAX_RUNE ? r.op = j.RUNE_ANY : e.length === 4 && e[0] === 0 && e[1] === w.CODES.get("\n") - 1 && e[2] === w.CODES.get("\n") + 1 && e[3] === D.MAX_RUNE && (r.op = j.RUNE_ANY_NOT_NL), n;
	}
	lookBehind(t, n) {
		let r = this.newInst(j.LB_WRITE);
		this.prog.getInst(r.i).arg = n;
		let i = this.rune(e.ANY_RUNE(), 0), a = this.star(i, !0), o = this.cat(a, t);
		this.prog.patch(o.out, r.i);
		let s = this.newInst(j.LB_CHECK);
		return this.prog.getInst(s.i).arg = n, this.prog.lbStarts.push(o.i), Math.abs(n) > this.prog.numLb && (this.prog.numLb = Math.abs(n)), s.out = new Us(s.i << 1, s.i << 1), s;
	}
	compile(t) {
		switch (t.op) {
			case M.Op.NO_MATCH: return this.fail();
			case M.Op.EMPTY_MATCH: return this.nop();
			case M.Op.LITERAL:
				if (t.runes.length === 0) return this.nop();
				{
					let e = null;
					for (let n of t.runes) {
						let r = this.rune([n], t.flags);
						e = e === null ? r : this.cat(e, r);
					}
					return e;
				}
			case M.Op.CHAR_CLASS: return this.rune(t.runes, t.flags);
			case M.Op.ANY_CHAR_NOT_NL: return this.rune(e.ANY_RUNE_NOT_NL(), 0);
			case M.Op.ANY_CHAR: return this.rune(e.ANY_RUNE(), 0);
			case M.Op.BEGIN_LINE: return this.empty(O.EMPTY_BEGIN_LINE);
			case M.Op.END_LINE: return this.empty(O.EMPTY_END_LINE);
			case M.Op.BEGIN_TEXT: return this.empty(O.EMPTY_BEGIN_TEXT);
			case M.Op.END_TEXT: return this.empty(O.EMPTY_END_TEXT);
			case M.Op.WORD_BOUNDARY: return this.empty(O.EMPTY_WORD_BOUNDARY);
			case M.Op.NO_WORD_BOUNDARY: return this.empty(O.EMPTY_NO_WORD_BOUNDARY);
			case M.Op.PLB:
			case M.Op.NLB: return this.lookBehind(this.compile(t.subs[0]), t.lb);
			case M.Op.CAPTURE: {
				let e = this.cap(t.cap << 1), n = this.compile(t.subs[0]), r = this.cap(t.cap << 1 | 1);
				return this.cat(this.cat(e, n), r);
			}
			case M.Op.STAR: return this.star(this.compile(t.subs[0]), (t.flags & C.NON_GREEDY) !== 0);
			case M.Op.PLUS: return this.plus(this.compile(t.subs[0]), (t.flags & C.NON_GREEDY) !== 0);
			case M.Op.QUEST: return this.quest(this.compile(t.subs[0]), (t.flags & C.NON_GREEDY) !== 0);
			case M.Op.CONCAT:
				if (t.subs.length === 0) return this.nop();
				{
					let e = null;
					for (let n of t.subs) {
						let t = this.compile(n);
						e = e === null ? t : this.cat(e, t);
					}
					return e;
				}
			case M.Op.ALTERNATE:
				if (t.subs.length === 0) return this.nop();
				{
					let e = null;
					for (let n of t.subs) {
						let t = this.compile(n);
						e = e === null ? t : this.alt(e, t);
					}
					return e;
				}
			default: throw new gs("regexp: unhandled case in compile");
		}
	}
}, qs = class e {
	static simplify(t) {
		if (t === null) return null;
		switch (t.op) {
			case M.Op.PLB:
			case M.Op.NLB:
			case M.Op.CAPTURE: {
				let n = e.simplify(t.subs[0]);
				if (n !== t.subs[0]) {
					let e = M.fromRegexp(t);
					return e.runes = [], e.subs = [n], e;
				}
				return t;
			}
			case M.Op.CONCAT:
			case M.Op.ALTERNATE: {
				let n = [], r = !1;
				for (let i = 0; i < t.subs.length; i++) {
					let a = t.subs[i], o = e.simplify(a);
					if (o !== a && (r = !0), t.op === M.Op.CONCAT) {
						if (o.op === M.Op.NO_MATCH) return new M(M.Op.NO_MATCH);
						if (o.op === M.Op.EMPTY_MATCH) {
							r = !0;
							continue;
						}
						if (o.op === M.Op.CONCAT) {
							r = !0;
							for (let e = 0; e < o.subs.length; e++) n.push(o.subs[e]);
							continue;
						}
					} else if (t.op === M.Op.ALTERNATE) {
						if (o.op === M.Op.NO_MATCH) {
							r = !0;
							continue;
						}
						if (o.op === M.Op.ALTERNATE) {
							r = !0;
							for (let e = 0; e < o.subs.length; e++) n.push(o.subs[e]);
							continue;
						}
					}
					n.push(o);
				}
				if (r) {
					if (n.length === 0) return new M(t.op === M.Op.CONCAT ? M.Op.EMPTY_MATCH : M.Op.NO_MATCH);
					if (n.length === 1) return n[0];
					let e = M.fromRegexp(t);
					return e.runes = [], e.subs = n, e;
				}
				return t;
			}
			case M.Op.CHAR_CLASS: return t.runes === null ? t : t.runes.length === 0 ? new M(M.Op.NO_MATCH) : t.runes.length === 2 && t.runes[0] === 0 && t.runes[1] === D.MAX_RUNE ? new M(M.Op.ANY_CHAR) : t.runes.length === 4 && t.runes[0] === 0 && t.runes[1] === w.CODES.get("\n") - 1 && t.runes[2] === w.CODES.get("\n") + 1 && t.runes[3] === D.MAX_RUNE ? new M(M.Op.ANY_CHAR_NOT_NL) : t;
			case M.Op.STAR:
			case M.Op.PLUS:
			case M.Op.QUEST: {
				let n = e.simplify(t.subs[0]);
				return e.simplify1(t.op, t.flags, n, t);
			}
			case M.Op.REPEAT: {
				if (t.min === 0 && t.max === 0) return new M(M.Op.EMPTY_MATCH);
				let n = e.simplify(t.subs[0]);
				if (t.max === -1) {
					if (t.min === 0) return e.simplify1(M.Op.STAR, t.flags, n, null);
					if (t.min === 1) return e.simplify1(M.Op.PLUS, t.flags, n, null);
					let r = new M(M.Op.CONCAT), i = [];
					for (let e = 0; e < t.min - 1; e++) i.push(n);
					return i.push(e.simplify1(M.Op.PLUS, t.flags, n, null)), r.subs = i.slice(0), e.simplify(r);
				}
				if (t.min === 1 && t.max === 1) return n;
				let r = null;
				if (t.min > 0) {
					r = [];
					for (let e = 0; e < t.min; e++) r.push(n);
				}
				if (t.max > t.min) {
					let i = e.simplify1(M.Op.QUEST, t.flags, n, null);
					for (let r = t.min + 1; r < t.max; r++) {
						let r = new M(M.Op.CONCAT);
						r.subs = [n, i], i = e.simplify1(M.Op.QUEST, t.flags, r, null);
					}
					if (r === null) return i;
					r.push(i);
				}
				if (r !== null) {
					let t = new M(M.Op.CONCAT);
					return t.subs = r.slice(0), e.simplify(t);
				}
				return new M(M.Op.NO_MATCH);
			}
		}
		return t;
	}
	static simplify1(e, t, n, r) {
		if (n.op === M.Op.EMPTY_MATCH) return n;
		if (n.op === M.Op.NO_MATCH) return e === M.Op.PLUS ? n : new M(M.Op.EMPTY_MATCH);
		if (e === n.op && (t & C.NON_GREEDY) === (n.flags & C.NON_GREEDY)) return n;
		if (r !== null && r.op === e && (r.flags & C.NON_GREEDY) === (t & C.NON_GREEDY) && n === r.subs[0]) return r;
		let i = new M(e);
		return i.flags = t, i.subs = [n], i;
	}
}, P = class {
	constructor(e, t) {
		this.sign = e, this.cls = t;
	}
}, Js = [48, 57], Ys = [
	9,
	10,
	12,
	13,
	32,
	32
], Xs = [
	48,
	57,
	65,
	90,
	95,
	95,
	97,
	122
], Zs = /* @__PURE__ */ new Map([
	["\\d", new P(1, Js)],
	["\\D", new P(-1, Js)],
	["\\s", new P(1, Ys)],
	["\\S", new P(-1, Ys)],
	["\\w", new P(1, Xs)],
	["\\W", new P(-1, Xs)]
]), Qs = [
	48,
	57,
	65,
	90,
	97,
	122
], $s = [
	65,
	90,
	97,
	122
], ec = [0, 127], tc = [
	9,
	9,
	32,
	32
], nc = [
	0,
	31,
	127,
	127
], rc = [48, 57], ic = [33, 126], ac = [97, 122], oc = [32, 126], sc = [
	33,
	47,
	58,
	64,
	91,
	96,
	123,
	126
], cc = [
	9,
	13,
	32,
	32
], lc = [65, 90], uc = [
	48,
	57,
	65,
	90,
	95,
	95,
	97,
	122
], dc = [
	48,
	57,
	65,
	70,
	97,
	102
], fc = /* @__PURE__ */ new Map([
	["[:alnum:]", new P(1, Qs)],
	["[:^alnum:]", new P(-1, Qs)],
	["[:alpha:]", new P(1, $s)],
	["[:^alpha:]", new P(-1, $s)],
	["[:ascii:]", new P(1, ec)],
	["[:^ascii:]", new P(-1, ec)],
	["[:blank:]", new P(1, tc)],
	["[:^blank:]", new P(-1, tc)],
	["[:cntrl:]", new P(1, nc)],
	["[:^cntrl:]", new P(-1, nc)],
	["[:digit:]", new P(1, rc)],
	["[:^digit:]", new P(-1, rc)],
	["[:graph:]", new P(1, ic)],
	["[:^graph:]", new P(-1, ic)],
	["[:lower:]", new P(1, ac)],
	["[:^lower:]", new P(-1, ac)],
	["[:print:]", new P(1, oc)],
	["[:^print:]", new P(-1, oc)],
	["[:punct:]", new P(1, sc)],
	["[:^punct:]", new P(-1, sc)],
	["[:space:]", new P(1, cc)],
	["[:^space:]", new P(-1, cc)],
	["[:upper:]", new P(1, lc)],
	["[:^upper:]", new P(-1, lc)],
	["[:word:]", new P(1, uc)],
	["[:^word:]", new P(-1, uc)],
	["[:xdigit:]", new P(1, dc)],
	["[:^xdigit:]", new P(-1, dc)]
]), pc = class e {
	static charClassToString(e, t) {
		let n = "[";
		for (let r = 0; r < t; r += 2) {
			r > 0 && (n += " ");
			let t = e[r], i = e[r + 1];
			n += t === i ? `0x${t.toString(16)}` : `0x${t.toString(16)}-0x${i.toString(16)}`;
		}
		return n += "]", n;
	}
	static cmp(e, t, n, r) {
		let i = e[t] - n;
		return i === 0 ? r - e[t + 1] : i;
	}
	static qsortIntPair(t, n, r) {
		let i = ((n + r) / 2 | 0) & -2, a = t[i], o = t[i + 1], s = n, c = r;
		for (; s <= c;) {
			for (; s < r && e.cmp(t, s, a, o) < 0;) s += 2;
			for (; c > n && e.cmp(t, c, a, o) > 0;) c -= 2;
			if (s <= c) {
				if (s !== c) {
					let e = t[s];
					t[s] = t[c], t[c] = e, e = t[s + 1], t[s + 1] = t[c + 1], t[c + 1] = e;
				}
				s += 2, c -= 2;
			}
		}
		n < c && e.qsortIntPair(t, n, c), s < r && e.qsortIntPair(t, s, r);
	}
	constructor(e = O.emptyInts()) {
		this.r = e, this.len = e.length;
	}
	toArray() {
		return this.len === this.r.length ? this.r : this.r.slice(0, this.len);
	}
	cleanClass() {
		if (this.len < 4) return this;
		e.qsortIntPair(this.r, 0, this.len - 2);
		let t = 2;
		for (let e = 2; e < this.len; e += 2) {
			let n = this.r[e], r = this.r[e + 1];
			if (n <= this.r[t - 1] + 1) {
				r > this.r[t - 1] && (this.r[t - 1] = r);
				continue;
			}
			this.r[t] = n, this.r[t + 1] = r, t += 2;
		}
		return this.len = t, this;
	}
	appendLiteral(e, t) {
		return (t & C.FOLD_CASE) === 0 ? this.appendRange(e, e) : this.appendFoldedRange(e, e);
	}
	appendRange(e, t) {
		if (this.len > 0) {
			for (let n = 2; n <= 4; n += 2) if (this.len >= n) {
				let r = this.r[this.len - n], i = this.r[this.len - n + 1];
				if (e <= i + 1 && r <= t + 1) return e < r && (this.r[this.len - n] = e), t > i && (this.r[this.len - n + 1] = t), this;
			}
		}
		return this.r[this.len++] = e, this.r[this.len++] = t, this;
	}
	appendFoldedRange(e, t) {
		if (e <= D.MIN_FOLD && t >= D.MAX_FOLD || t < D.MIN_FOLD || e > D.MAX_FOLD) return this.appendRange(e, t);
		e < D.MIN_FOLD && (this.appendRange(e, D.MIN_FOLD - 1), e = D.MIN_FOLD), t > D.MAX_FOLD && (this.appendRange(D.MAX_FOLD + 1, t), t = D.MAX_FOLD);
		for (let n = e; n <= t; n++) {
			this.appendRange(n, n);
			for (let e = D.simpleFold(n); e !== n; e = D.simpleFold(e)) this.appendRange(e, e);
		}
		return this;
	}
	appendClass(e) {
		for (let t = 0; t < e.length; t += 2) this.appendRange(e[t], e[t + 1]);
		return this;
	}
	appendFoldedClass(e) {
		for (let t = 0; t < e.length; t += 2) this.appendFoldedRange(e[t], e[t + 1]);
		return this;
	}
	appendNegatedClass(e) {
		let t = 0;
		for (let n = 0; n < e.length; n += 2) {
			let r = e[n], i = e[n + 1];
			t <= r - 1 && this.appendRange(t, r - 1), t = i + 1;
		}
		return t <= D.MAX_RUNE && this.appendRange(t, D.MAX_RUNE), this;
	}
	appendTable(e) {
		for (let t = 0; t < e.length; ++t) {
			let n = e.getLo(t), r = e.getHi(t), i = e.getStride(t);
			if (i === 1) {
				this.appendRange(n, r);
				continue;
			}
			for (let e = n; e <= r; e += i) this.appendRange(e, e);
		}
		return this;
	}
	appendNegatedTable(e) {
		let t = 0;
		for (let n = 0; n < e.length; ++n) {
			let r = e.getLo(n), i = e.getHi(n), a = e.getStride(n);
			if (a === 1) {
				t <= r - 1 && this.appendRange(t, r - 1), t = i + 1;
				continue;
			}
			for (let e = r; e <= i; e += a) t <= e - 1 && this.appendRange(t, e - 1), t = e + 1;
		}
		return t <= D.MAX_RUNE && this.appendRange(t, D.MAX_RUNE), this;
	}
	appendTableWithSign(e, t) {
		return t < 0 ? this.appendNegatedTable(e) : this.appendTable(e);
	}
	negateClass() {
		let e = 0, t = 0;
		for (let n = 0; n < this.len; n += 2) {
			let r = this.r[n], i = this.r[n + 1];
			e <= r - 1 && (this.r[t] = e, this.r[t + 1] = r - 1, t += 2), e = i + 1;
		}
		return this.len = t, e <= D.MAX_RUNE && (this.r[this.len++] = e, this.r[this.len++] = D.MAX_RUNE), this;
	}
	appendClassWithSign(e, t) {
		return t < 0 ? this.appendNegatedClass(e) : this.appendClass(e);
	}
	appendGroup(t, n) {
		let r = t.cls;
		return n && (r = new e().appendFoldedClass(r).cleanClass().toArray()), this.appendClassWithSign(r, t.sign);
	}
	toString() {
		return e.charClassToString(this.r, this.len);
	}
}, mc = class {
	constructor(e) {
		this.str = e, this.position = 0;
	}
	pos() {
		return this.position;
	}
	rewindTo(e) {
		this.position = e;
	}
	more() {
		return this.position < this.str.length;
	}
	peek() {
		return this.str.codePointAt(this.position);
	}
	skip(e) {
		this.position += e;
	}
	skipString(e) {
		this.position += e.length;
	}
	pop() {
		let e = this.str.codePointAt(this.position);
		return this.position += O.charCount(e), e;
	}
	lookingAt(e) {
		return this.str.startsWith(e, this.position);
	}
	rest() {
		return this.str.substring(this.position);
	}
	from(e) {
		return this.str.substring(e, this.position);
	}
	toString() {
		return this.rest();
	}
}, hc = class e {
	static ERR_INTERNAL_ERROR = "regexp/syntax: internal error";
	static ERR_INVALID_CHAR_RANGE = "invalid character class range";
	static ERR_INVALID_ESCAPE = "invalid escape sequence";
	static ERR_INVALID_NAMED_CAPTURE = "invalid named capture";
	static ERR_INVALID_PERL_OP = "invalid or unsupported Perl syntax";
	static ERR_INVALID_REPEAT_OP = "invalid nested repetition operator";
	static ERR_INVALID_REPEAT_SIZE = "invalid repeat count";
	static ERR_MISSING_BRACKET = "missing closing ]";
	static ERR_MISSING_PAREN = "missing closing )";
	static ERR_MISSING_REPEAT_ARGUMENT = "missing argument to repetition operator";
	static ERR_TRAILING_BACKSLASH = "trailing backslash at end of expression";
	static ERR_DUPLICATE_NAMED_CAPTURE = "duplicate capture group name";
	static ERR_UNEXPECTED_PAREN = "unexpected )";
	static ERR_NESTING_DEPTH = "expression nests too deeply";
	static ERR_LARGE = "expression too large";
	static ERR_INVALID_CAPTURE_IN_LOOKBEHIND = "invalid capture in lookbehind";
	static MAX_HEIGHT = 1e3;
	static MAX_SIZE = 3355443;
	static MAX_RUNES = 33554432;
	static ANY_TABLE = new T(new Uint32Array([
		0,
		D.MAX_RUNE,
		1
	]));
	static ASCII_TABLE = new T(new Uint32Array([
		0,
		127,
		1
	]));
	static ASCII_FOLD_TABLE = new T(new Uint32Array([
		0,
		127,
		1,
		383,
		383,
		1,
		8490,
		8490,
		1
	]));
	static unicodeTable(t) {
		return t === "Any" ? {
			tab: e.ANY_TABLE,
			fold: e.ANY_TABLE,
			sign: 1
		} : t === "Ascii" ? {
			tab: e.ASCII_TABLE,
			fold: e.ASCII_FOLD_TABLE,
			sign: 1
		} : t === "Assigned" ? {
			tab: ns.CATEGORIES.get("Cn"),
			fold: ns.CATEGORIES.get("Cn"),
			sign: -1
		} : t === "Lc" ? {
			tab: ns.CATEGORIES.get("LC"),
			fold: ns.FOLD_CATEGORIES.get("LC"),
			sign: 1
		} : ns.CATEGORIES.has(t) ? {
			tab: ns.CATEGORIES.get(t),
			fold: ns.FOLD_CATEGORIES.get(t),
			sign: 1
		} : ns.SCRIPTS.has(t) ? {
			tab: ns.SCRIPTS.get(t),
			fold: ns.FOLD_SCRIPT.get(t),
			sign: 1
		} : null;
	}
	static minFoldRune(e) {
		if (e < D.MIN_FOLD || e > D.MAX_FOLD) return e;
		let t = e, n = e;
		for (e = D.simpleFold(e); e !== n; e = D.simpleFold(e)) t > e && (t = e);
		return t;
	}
	static leadingRegexp(e) {
		if (e.op === M.Op.EMPTY_MATCH) return null;
		if (e.op === M.Op.CONCAT && e.subs.length > 0) {
			let t = e.subs[0];
			return t.op === M.Op.EMPTY_MATCH ? null : t;
		}
		return e;
	}
	static literalRegexp(e, t) {
		let n = new M(M.Op.LITERAL);
		return n.flags = t, n.runes = O.stringToRunes(e), n;
	}
	static parse(t, n) {
		return new e(t, n).parseInternal();
	}
	static parseRepeat(t) {
		let n = t.pos();
		if (!t.more() || !t.lookingAt("{")) return -1;
		t.skip(1);
		let r = e.parseInt(t);
		if (r === -1 || !t.more()) return -1;
		let i;
		if (!t.lookingAt(",")) i = r;
		else {
			if (t.skip(1), !t.more()) return -1;
			if (t.lookingAt("}")) i = -1;
			else if ((i = e.parseInt(t)) === -1) return -1;
		}
		if (!t.more() || !t.lookingAt("}")) return -1;
		if (t.skip(1), r < 0 || r > 1e3 || i === -2 || i > 1e3 || i >= 0 && r > i) throw new A(e.ERR_INVALID_REPEAT_SIZE, t.from(n));
		return r << 16 | i & D.MAX_BMP;
	}
	static isValidCaptureName(e) {
		if (e.length === 0) return !1;
		for (let t = 0; t < e.length; t++) {
			let n = e.codePointAt(t);
			if (n !== w.CODES.get("_") && !O.isalnum(n)) return !1;
		}
		return !0;
	}
	static parseInt(e) {
		let t = e.pos();
		for (; e.more() && e.peek() >= w.CODES.get("0") && e.peek() <= w.CODES.get("9");) e.skip(1);
		let n = e.from(t);
		return n.length === 0 || n.length > 1 && n.codePointAt(0) === w.CODES.get("0") ? -1 : n.length > 8 ? -2 : parseInt(n, 10);
	}
	static isCharClass(e) {
		return e.op === M.Op.LITERAL && e.runes.length === 1 || e.op === M.Op.CHAR_CLASS || e.op === M.Op.ANY_CHAR_NOT_NL || e.op === M.Op.ANY_CHAR;
	}
	static matchRune(e, t) {
		switch (e.op) {
			case M.Op.LITERAL: return e.runes.length === 1 && e.runes[0] === t;
			case M.Op.CHAR_CLASS:
				for (let n = 0; n < e.runes.length; n += 2) if (e.runes[n] <= t && t <= e.runes[n + 1]) return !0;
				return !1;
			case M.Op.ANY_CHAR_NOT_NL: return t !== w.CODES.get("\n");
			case M.Op.ANY_CHAR: return !0;
		}
		return !1;
	}
	static mergeCharClass(t, n) {
		switch (t.op) {
			case M.Op.ANY_CHAR: break;
			case M.Op.ANY_CHAR_NOT_NL:
				e.matchRune(n, w.CODES.get("\n")) && (t.op = M.Op.ANY_CHAR);
				break;
			case M.Op.CHAR_CLASS:
				t.runes = n.op === M.Op.LITERAL ? new pc(t.runes).appendLiteral(n.runes[0], n.flags).toArray() : new pc(t.runes).appendClass(n.runes).toArray();
				break;
			case M.Op.LITERAL:
				if (n.runes[0] === t.runes[0] && n.flags === t.flags) break;
				t.op = M.Op.CHAR_CLASS, t.runes = new pc().appendLiteral(t.runes[0], t.flags).appendLiteral(n.runes[0], n.flags).toArray();
		}
	}
	static parseEscape(t) {
		let n = t.pos();
		if (t.skip(1), !t.more()) throw new A(e.ERR_TRAILING_BACKSLASH);
		let r = t.pop();
		bigswitch: switch (r) {
			case w.CODES.get("1"):
			case w.CODES.get("2"):
			case w.CODES.get("3"):
			case w.CODES.get("4"):
			case w.CODES.get("5"):
			case w.CODES.get("6"):
			case w.CODES.get("7"): if (!t.more() || t.peek() < w.CODES.get("0") || t.peek() > w.CODES.get("7")) break;
			case w.CODES.get("0"): {
				let e = r - w.CODES.get("0");
				for (let n = 1; n < 3 && !(!t.more() || t.peek() < w.CODES.get("0") || t.peek() > w.CODES.get("7")); n++) e = e * 8 + t.peek() - w.CODES.get("0"), t.skip(1);
				return e;
			}
			case w.CODES.get("x"): {
				if (!t.more()) break;
				if (r = t.pop(), r === w.CODES.get("{")) {
					let e = 0, n = 0;
					for (;;) {
						if (!t.more()) break bigswitch;
						if (r = t.pop(), r === w.CODES.get("}")) break;
						let i = O.unhex(r);
						if (i < 0 || (n = n * 16 + i, n > D.MAX_RUNE)) break bigswitch;
						e++;
					}
					if (e === 0) break bigswitch;
					return n;
				}
				let e = O.unhex(r);
				if (!t.more()) break;
				r = t.pop();
				let n = O.unhex(r);
				if (e < 0 || n < 0) break;
				return e * 16 + n;
			}
			case w.CODES.get("a"): return w.CODES.get("\x07");
			case w.CODES.get("f"): return w.CODES.get("\f");
			case w.CODES.get("n"): return w.CODES.get("\n");
			case w.CODES.get("r"): return w.CODES.get("\r");
			case w.CODES.get("t"): return w.CODES.get("	");
			case w.CODES.get("v"): return w.CODES.get("\v");
			default: if (r <= D.MAX_ASCII && !O.isalnum(r)) return r;
		}
		throw new A(e.ERR_INVALID_ESCAPE, t.from(n));
	}
	static parseClassChar(t, n) {
		if (!t.more()) throw new A(e.ERR_MISSING_BRACKET, t.from(n));
		return t.lookingAt("\\") ? e.parseEscape(t) : t.pop();
	}
	static concatRunes(e, t) {
		for (let n = 0; n < t.length; n++) e.push(t[n]);
		return e;
	}
	static hasCapture(t) {
		if (t === null) return !1;
		if (t.op === M.Op.CAPTURE) return !0;
		if (t.subs) {
			for (let n of t.subs) if (e.hasCapture(n)) return !0;
		}
		return !1;
	}
	constructor(e, t = 0) {
		this.wholeRegexp = e, this.flags = t, this.numCap = 0, this.namedGroups = Object.create(null), this.stack = [], this.free = null, this.numRegexp = 0, this.numRunes = 0, this.repeats = 0, this.height = null, this.size = null, this.nlb = 0;
	}
	newRegexp(e) {
		let t = this.free;
		return t !== null && t.subs !== null && t.subs.length > 0 ? (this.free = t.subs[0], t.reinit(), t.op = e) : (t = new M(e), this.numRegexp += 1), t;
	}
	reuse(e) {
		this.height !== null && this.height.has(e) && this.height.delete(e), e.subs !== null && e.subs.length > 0 && (e.subs[0] = this.free), this.free = e;
	}
	checkLimits(t) {
		if (this.numRunes > e.MAX_RUNES) throw new A(e.ERR_LARGE);
		this.checkSize(t), this.checkHeight(t);
	}
	checkSize(t) {
		if (this.size === null) {
			if (this.repeats === 0 && (this.repeats = 1), t.op === M.Op.REPEAT) {
				let n = t.max;
				n === -1 && (n = t.min), n <= 0 && (n = 1), n > Math.floor(e.MAX_SIZE / this.repeats) ? this.repeats = e.MAX_SIZE : this.repeats *= n;
			}
			if (this.numRegexp < Math.floor(e.MAX_SIZE / this.repeats)) return;
			this.size = /* @__PURE__ */ new Map();
			for (let e of this.stack) this.checkSize(e);
		}
		if (this.calcSize(t, !0) > e.MAX_SIZE) throw new A(e.ERR_LARGE);
	}
	calcSize(e, t = !1) {
		if (!t && this.size !== null && this.size.has(e)) return this.size.get(e);
		let n = 0;
		switch (e.op) {
			case M.Op.LITERAL:
				n = e.runes.length;
				break;
			case M.Op.PLB:
			case M.Op.NLB:
			case M.Op.CAPTURE:
			case M.Op.STAR:
				n = 2 + this.calcSize(e.subs[0]);
				break;
			case M.Op.PLUS:
			case M.Op.QUEST:
				n = 1 + this.calcSize(e.subs[0]);
				break;
			case M.Op.CONCAT:
				for (let t of e.subs) n += this.calcSize(t);
				break;
			case M.Op.ALTERNATE:
				for (let t of e.subs) n += this.calcSize(t);
				e.subs.length > 1 && (n = n + e.subs.length - 1);
				break;
			case M.Op.REPEAT: {
				let t = this.calcSize(e.subs[0]);
				if (e.max === -1) {
					n = e.min === 0 ? 2 + t : 1 + e.min * t;
					break;
				}
				n = e.max * t + (e.max - e.min);
				break;
			}
		}
		return n = Math.max(1, n), this.size === null && (this.size = /* @__PURE__ */ new Map()), this.size.set(e, n), n;
	}
	checkHeight(t) {
		if (!(this.numRegexp < e.MAX_HEIGHT)) {
			if (this.height === null) {
				this.height = /* @__PURE__ */ new Map();
				for (let e of this.stack) this.checkHeight(e);
			}
			if (this.calcHeight(t, !0) > e.MAX_HEIGHT) throw new A(e.ERR_NESTING_DEPTH);
		}
	}
	calcHeight(e, t = !1) {
		if (!t && this.height !== null && this.height.has(e)) return this.height.get(e);
		let n = 1;
		for (let t of e.subs) {
			let e = this.calcHeight(t);
			n < 1 + e && (n = 1 + e);
		}
		return this.height === null && (this.height = /* @__PURE__ */ new Map()), this.height.set(e, n), n;
	}
	pop() {
		return this.stack.pop();
	}
	popToPseudo() {
		let e = this.stack.length, t = e;
		for (; t > 0 && !M.isPseudoOp(this.stack[t - 1].op);) t--;
		let n = this.stack.slice(t, e);
		return this.stack = this.stack.slice(0, t), n;
	}
	push(e) {
		if (this.numRunes += e.runes.length, e.op === M.Op.CHAR_CLASS && e.runes.length === 2 && e.runes[0] === e.runes[1]) {
			if (this.maybeConcat(e.runes[0], this.flags & ~C.FOLD_CASE)) return null;
			e.op = M.Op.LITERAL, e.runes = [e.runes[0]], e.flags = this.flags & ~C.FOLD_CASE;
		} else if (e.op === M.Op.CHAR_CLASS && e.runes.length === 4 && e.runes[0] === e.runes[1] && e.runes[2] === e.runes[3] && D.simpleFold(e.runes[0]) === e.runes[2] && D.simpleFold(e.runes[2]) === e.runes[0] || e.op === M.Op.CHAR_CLASS && e.runes.length === 2 && e.runes[0] + 1 === e.runes[1] && D.simpleFold(e.runes[0]) === e.runes[1] && D.simpleFold(e.runes[1]) === e.runes[0]) {
			if (this.maybeConcat(e.runes[0], this.flags | C.FOLD_CASE)) return null;
			e.op = M.Op.LITERAL, e.runes = [e.runes[0]], e.flags = this.flags | C.FOLD_CASE;
		} else this.maybeConcat(-1, 0);
		return this.stack.push(e), this.checkLimits(e), e;
	}
	maybeConcat(t, n) {
		let r = this.stack.length;
		if (r < 2) return !1;
		let i = this.stack[r - 1], a = this.stack[r - 2];
		return i.op !== M.Op.LITERAL || a.op !== M.Op.LITERAL || (i.flags & C.FOLD_CASE) !== (a.flags & C.FOLD_CASE) ? !1 : (a.runes = e.concatRunes(a.runes, i.runes), t >= 0 ? (i.runes = [t], i.flags = n, !0) : (this.pop(), this.reuse(i), !1));
	}
	newLiteral(t, n) {
		let r = this.newRegexp(M.Op.LITERAL);
		return r.flags = n, (n & C.FOLD_CASE) !== 0 && (t = e.minFoldRune(t)), r.runes = [t], r;
	}
	literal(e) {
		this.push(this.newLiteral(e, this.flags));
	}
	op(e) {
		let t = this.newRegexp(e);
		return t.flags = this.flags, this.push(t);
	}
	repeat(t, n, r, i, a, o) {
		let s = this.flags;
		if ((s & C.PERL_X) !== 0 && (a.more() && a.lookingAt("?") && (a.skip(1), s ^= C.NON_GREEDY), o !== -1)) throw new A(e.ERR_INVALID_REPEAT_OP, a.from(o));
		let c = this.stack.length;
		if (c === 0) throw new A(e.ERR_MISSING_REPEAT_ARGUMENT, a.from(i));
		let l = this.stack[c - 1];
		if (M.isPseudoOp(l.op)) throw new A(e.ERR_MISSING_REPEAT_ARGUMENT, a.from(i));
		let u = this.newRegexp(t);
		if (u.min = n, u.max = r, u.flags = s, u.subs = [l], this.stack[c - 1] = u, this.checkLimits(u), t === M.Op.REPEAT && (n >= 2 || r >= 2) && !this.repeatIsValid(u, 1e3)) throw new A(e.ERR_INVALID_REPEAT_SIZE, a.from(i));
	}
	repeatIsValid(e, t) {
		if (e.op === M.Op.REPEAT) {
			let n = e.max;
			if (n === 0) return !0;
			if (n < 0 && (n = e.min), n > t) return !1;
			n > 0 && (t = Math.trunc(t / n));
		}
		for (let n of e.subs) if (!this.repeatIsValid(n, t)) return !1;
		return !0;
	}
	concat() {
		this.maybeConcat(-1, 0);
		let e = this.popToPseudo();
		return e.length === 0 ? this.push(this.newRegexp(M.Op.EMPTY_MATCH)) : this.push(this.collapse(e, M.Op.CONCAT));
	}
	alternate() {
		let e = this.popToPseudo();
		return e.length > 0 && this.cleanAlt(e[e.length - 1]), e.length === 0 ? this.push(this.newRegexp(M.Op.NO_MATCH)) : this.push(this.collapse(e, M.Op.ALTERNATE));
	}
	cleanAlt(e) {
		e.op === M.Op.CHAR_CLASS && (e.runes = new pc(e.runes).cleanClass().toArray(), e.runes.length === 2 && e.runes[0] === 0 && e.runes[1] === D.MAX_RUNE ? (e.runes = [], e.op = M.Op.ANY_CHAR) : e.runes.length === 4 && e.runes[0] === 0 && e.runes[1] === w.CODES.get("\n") - 1 && e.runes[2] === w.CODES.get("\n") + 1 && e.runes[3] === D.MAX_RUNE && (e.runes = [], e.op = M.Op.ANY_CHAR_NOT_NL));
	}
	collapse(e, t) {
		if (e.length === 1) return e[0];
		let n = 0;
		for (let r of e) n += r.op === t ? r.subs.length : 1;
		let r = Array(n).fill(null), i = 0;
		for (let n of e) if (n.op === t) {
			for (let e = 0; e < n.subs.length; e++) r[i++] = n.subs[e];
			this.reuse(n);
		} else r[i++] = n;
		let a = this.newRegexp(t);
		if (a.subs = r, t === M.Op.ALTERNATE && (a.subs = this.factor(a.subs), a.subs.length === 1)) {
			let e = a;
			a = a.subs[0], this.reuse(e);
		}
		return a;
	}
	factor(t) {
		if (t.length < 2) return t;
		let n = 0, r = t.length, i = 0, a = null, o = 0, s = 0, c = 0;
		for (let e = 0; e <= r; e++) {
			let l = null, u = 0, d = 0;
			if (e < r) {
				let r = t[n + e];
				if (r.op === M.Op.CONCAT && r.subs.length > 0 && (r = r.subs[0]), r.op === M.Op.LITERAL && (l = r.runes, u = r.runes.length, d = r.flags & C.FOLD_CASE), d === s) {
					let e = 0;
					for (; e < o && e < u && a[e] === l[e];) e++;
					if (e > 0) {
						o = e;
						continue;
					}
				}
			}
			if (e !== c) {
				if (e === c + 1) t[i++] = t[n + c];
				else {
					let r = this.newRegexp(M.Op.LITERAL);
					r.flags = s, r.runes = a.slice(0, o);
					for (let r = c; r < e; r++) t[n + r] = this.removeLeadingString(t[n + r], o), this.checkLimits(t[n + r]);
					let l = this.collapse(t.slice(n + c, n + e), M.Op.ALTERNATE), u = this.newRegexp(M.Op.CONCAT);
					u.subs = [r, l], t[i++] = u;
				}
			}
			c = e, a = l, o = u, s = d;
		}
		r = i, n = 0, c = 0, i = 0;
		let l = null;
		for (let a = 0; a <= r; a++) {
			let o = null;
			if (!(a < r && (o = e.leadingRegexp(t[n + a]), l !== null && l.equals(o) && (e.isCharClass(l) || l.op === M.Op.REPEAT && l.min === l.max && e.isCharClass(l.subs[0]))))) {
				if (a !== c) {
					if (a === c + 1) t[i++] = t[n + c];
					else {
						let e = l;
						for (let e = c; e < a; e++) {
							let r = e !== c;
							t[n + e] = this.removeLeadingRegexp(t[n + e], r), this.checkLimits(t[n + e]);
						}
						let r = this.collapse(t.slice(n + c, n + a), M.Op.ALTERNATE), o = this.newRegexp(M.Op.CONCAT);
						o.subs = [e, r], t[i++] = o;
					}
				}
				c = a, l = o;
			}
		}
		r = i, n = 0, c = 0, i = 0;
		for (let a = 0; a <= r; a++) if (!(a < r && e.isCharClass(t[n + a]))) {
			if (a !== c) {
				if (a === c + 1) t[i++] = t[n + c];
				else {
					let r = c;
					for (let e = c + 1; e < a; e++) {
						let i = t[n + r], a = t[n + e];
						(i.op < a.op || i.op === a.op && (i.runes === null ? 0 : i.runes.length) < (a.runes === null ? 0 : a.runes.length)) && (r = e);
					}
					let o = t[n + c];
					t[n + c] = t[n + r], t[n + r] = o;
					for (let r = c + 1; r < a; r++) e.mergeCharClass(t[n + c], t[n + r]), this.reuse(t[n + r]);
					this.cleanAlt(t[n + c]), t[i++] = t[n + c];
				}
			}
			a < r && (t[i++] = t[n + a]), c = a + 1;
		}
		r = i, n = 0, c = 0, i = 0;
		for (let e = 0; e < r; ++e) e + 1 < r && t[n + e].op === M.Op.EMPTY_MATCH && t[n + e + 1].op === M.Op.EMPTY_MATCH || (t[i++] = t[n + e]);
		return r = i, n = 0, t.slice(n, r);
	}
	removeLeadingString(e, t) {
		if (e.op === M.Op.CONCAT && e.subs.length > 0) {
			let n = this.removeLeadingString(e.subs[0], t);
			if (e.subs[0] = n, n.op === M.Op.EMPTY_MATCH) switch (this.reuse(n), e.subs.length) {
				case 0:
				case 1:
					e.op = M.Op.EMPTY_MATCH, e.subs = M.emptySubs();
					break;
				case 2: {
					let t = e;
					e = e.subs[1], this.reuse(t);
					break;
				}
				default: e.subs = e.subs.slice(1, e.subs.length);
			}
			return e;
		}
		return e.op === M.Op.LITERAL && (e.runes = e.runes.slice(t, e.runes.length), e.runes.length === 0 && (e.op = M.Op.EMPTY_MATCH)), e;
	}
	removeLeadingRegexp(e, t) {
		if (e.op === M.Op.CONCAT && e.subs.length > 0) {
			switch (t && this.reuse(e.subs[0]), e.subs = e.subs.slice(1, e.subs.length), e.subs.length) {
				case 0:
					e.op = M.Op.EMPTY_MATCH, e.subs = M.emptySubs();
					break;
				case 1: {
					let t = e;
					e = e.subs[0], this.reuse(t);
					break;
				}
			}
			return e;
		}
		return t && this.reuse(e), this.newRegexp(M.Op.EMPTY_MATCH);
	}
	parseInternal() {
		if ((this.flags & C.LITERAL) !== 0) return e.literalRegexp(this.wholeRegexp, this.flags);
		let t = -1, n = -1, r = -1, i = new mc(this.wholeRegexp);
		for (; i.more();) {
			let a = -1;
			bigswitch: switch (i.peek()) {
				case w.CODES.get("("):
					if ((this.flags & C.LOOKBEHIND) !== 0) {
						if (i.lookingAt("(?<=")) {
							this.parsePosLookBehind(), i.skip(4);
							break;
						}
						if (i.lookingAt("(?<!")) {
							this.parseNegLookBehind(), i.skip(4);
							break;
						}
					}
					if ((this.flags & C.PERL_X) !== 0 && i.lookingAt("(?")) {
						this.parsePerlFlags(i);
						break;
					}
					this.op(M.Op.LEFT_PAREN).cap = ++this.numCap, i.skip(1);
					break;
				case w.CODES.get("|"):
					this.parseVerticalBar(), i.skip(1);
					break;
				case w.CODES.get(")"):
					this.parseRightParen(), i.skip(1);
					break;
				case w.CODES.get("^"):
					(this.flags & C.ONE_LINE) === 0 ? this.op(M.Op.BEGIN_LINE) : this.op(M.Op.BEGIN_TEXT), i.skip(1);
					break;
				case w.CODES.get("$"):
					(this.flags & C.ONE_LINE) === 0 ? this.op(M.Op.END_LINE) : this.op(M.Op.END_TEXT).flags |= C.WAS_DOLLAR, i.skip(1);
					break;
				case w.CODES.get("."):
					(this.flags & C.DOT_NL) === 0 ? this.op(M.Op.ANY_CHAR_NOT_NL) : this.op(M.Op.ANY_CHAR), i.skip(1);
					break;
				case w.CODES.get("["):
					this.parseClass(i);
					break;
				case w.CODES.get("*"):
				case w.CODES.get("+"):
				case w.CODES.get("?"): {
					a = i.pos();
					let e = null;
					switch (i.pop()) {
						case w.CODES.get("*"):
							e = M.Op.STAR;
							break;
						case w.CODES.get("+"):
							e = M.Op.PLUS;
							break;
						case w.CODES.get("?"): e = M.Op.QUEST;
					}
					this.repeat(e, n, r, a, i, t);
					break;
				}
				case w.CODES.get("{"): {
					a = i.pos();
					let o = e.parseRepeat(i);
					if (o < 0) {
						i.rewindTo(a), this.literal(i.pop());
						break;
					}
					n = o >> 16, r = (o & D.MAX_BMP) << 16 >> 16, this.repeat(M.Op.REPEAT, n, r, a, i, t);
					break;
				}
				case w.CODES.get("\\"): {
					let t = i.pos();
					if (i.skip(1), (this.flags & C.PERL_X) !== 0 && i.more()) switch (i.pop()) {
						case w.CODES.get("A"):
							this.op(M.Op.BEGIN_TEXT);
							break bigswitch;
						case w.CODES.get("b"):
							this.op(M.Op.WORD_BOUNDARY);
							break bigswitch;
						case w.CODES.get("B"):
							this.op(M.Op.NO_WORD_BOUNDARY);
							break bigswitch;
						case w.CODES.get("C"): throw new A(e.ERR_INVALID_ESCAPE, "\\C");
						case w.CODES.get("Q"): {
							let e = i.rest(), t = e.indexOf("\\E");
							t >= 0 ? (e = e.substring(0, t), i.skipString(e), i.skipString("\\E")) : i.skipString(e);
							let n = 0;
							for (; n < e.length;) {
								let t = e.codePointAt(n);
								this.literal(t), n += O.charCount(t);
							}
							break bigswitch;
						}
						case w.CODES.get("z"):
							this.op(M.Op.END_TEXT);
							break bigswitch;
						default:
							i.rewindTo(t);
							break;
					}
					else i.rewindTo(t);
					let n = this.newRegexp(M.Op.CHAR_CLASS);
					if (n.flags = this.flags, i.lookingAt("\\p") || i.lookingAt("\\P")) {
						let e = new pc();
						if (this.parseUnicodeClass(i, e)) {
							n.runes = e.toArray(), this.push(n);
							break bigswitch;
						}
					}
					let r = new pc();
					if (this.parsePerlClassEscape(i, r)) {
						n.runes = r.toArray(), this.push(n);
						break bigswitch;
					}
					i.rewindTo(t), this.reuse(n), this.literal(e.parseEscape(i));
					break;
				}
				default: this.literal(i.pop());
			}
			t = a;
		}
		if (this.concat(), this.swapVerticalBar() && this.pop(), this.alternate(), this.stack.length !== 1) throw new A(e.ERR_MISSING_PAREN, this.wholeRegexp);
		return this.stack[0].namedGroups = this.namedGroups, this.stack[0];
	}
	parsePerlFlags(t) {
		let n = t.pos(), r = t.rest();
		if (r.startsWith("(?P<") || r.startsWith("(?<")) {
			let n = r.charAt(2) === "P" ? 4 : 3, i = r.indexOf(">");
			if (i < 0) throw new A(e.ERR_INVALID_NAMED_CAPTURE, r);
			let a = r.substring(n, i);
			if (t.skipString(a), t.skip(n + 1), !e.isValidCaptureName(a)) throw new A(e.ERR_INVALID_NAMED_CAPTURE, r.substring(0, i + 1));
			let o = this.op(M.Op.LEFT_PAREN);
			if (o.cap = ++this.numCap, this.namedGroups[a]) throw new A(e.ERR_DUPLICATE_NAMED_CAPTURE, a);
			this.namedGroups[a] = this.numCap, o.name = a;
			return;
		}
		t.skip(2);
		let i = this.flags, a = 1, o = !1;
		loop: for (; t.more();) {
			let e = t.pop();
			switch (e) {
				case w.CODES.get("i"):
					i |= C.FOLD_CASE, o = !0;
					break;
				case w.CODES.get("m"):
					i &= ~C.ONE_LINE, o = !0;
					break;
				case w.CODES.get("s"):
					i |= C.DOT_NL, o = !0;
					break;
				case w.CODES.get("U"):
					i |= C.NON_GREEDY, o = !0;
					break;
				case w.CODES.get("-"):
					if (a < 0) break loop;
					a = -1, i = ~i, o = !1;
					break;
				case w.CODES.get(":"):
				case w.CODES.get(")"):
					if (a < 0) {
						if (!o) break loop;
						i = ~i;
					}
					e === w.CODES.get(":") && this.op(M.Op.LEFT_PAREN), this.flags = i;
					return;
				default: break loop;
			}
		}
		throw new A(e.ERR_INVALID_PERL_OP, t.from(n));
	}
	parsePosLookBehind() {
		let e = this.newRegexp(M.Op.LEFT_PAREN);
		return e.flags = this.flags, e.lb = ++this.nlb, this.push(e);
	}
	parseNegLookBehind() {
		let e = this.newRegexp(M.Op.LEFT_PAREN);
		return e.flags = this.flags, e.lb = -++this.nlb, this.push(e);
	}
	parseVerticalBar() {
		this.concat(), this.swapVerticalBar() || this.op(M.Op.VERTICAL_BAR);
	}
	swapVerticalBar() {
		let t = this.stack.length;
		if (t >= 3 && this.stack[t - 2].op === M.Op.VERTICAL_BAR && e.isCharClass(this.stack[t - 1]) && e.isCharClass(this.stack[t - 3])) {
			let n = this.stack[t - 1], r = this.stack[t - 3];
			if (n.op > r.op) {
				let e = r;
				r = n, n = e, this.stack[t - 3] = r;
			}
			return e.mergeCharClass(r, n), this.reuse(n), this.pop(), !0;
		}
		if (t >= 2) {
			let e = this.stack[t - 1], n = this.stack[t - 2];
			if (n.op === M.Op.VERTICAL_BAR) return t >= 3 && this.cleanAlt(this.stack[t - 3]), this.stack[t - 2] = e, this.stack[t - 1] = n, !0;
		}
		return !1;
	}
	parseRightParen() {
		if (this.concat(), this.swapVerticalBar() && this.pop(), this.alternate(), this.stack.length < 2) throw new A(e.ERR_UNEXPECTED_PAREN, this.wholeRegexp);
		let t = this.pop(), n = this.pop();
		if (n.op !== M.Op.LEFT_PAREN) throw new A(e.ERR_UNEXPECTED_PAREN, this.wholeRegexp);
		if (this.flags = n.flags, n.lb !== 0) {
			if (e.hasCapture(t)) throw new A(e.ERR_INVALID_CAPTURE_IN_LOOKBEHIND, this.wholeRegexp);
			n.op = n.lb > 0 ? M.Op.PLB : M.Op.NLB, n.subs = [t], this.push(n);
			return;
		}
		n.cap === 0 ? this.push(t) : (n.op = M.Op.CAPTURE, n.subs = [t], this.push(n));
	}
	parsePerlClassEscape(e, t) {
		let n = e.pos();
		if ((this.flags & C.PERL_X) === 0 || !e.more() || e.pop() !== w.CODES.get("\\") || !e.more()) return !1;
		e.pop();
		let r = e.from(n), i = Zs.has(r) ? Zs.get(r) : null;
		return i !== null && (t.appendGroup(i, (this.flags & C.FOLD_CASE) !== 0), !0);
	}
	parseNamedClass(t, n) {
		let r = t.rest(), i = r.indexOf(":]");
		if (i < 0) return !1;
		let a = r.substring(0, i + 2);
		t.skipString(a);
		let o = fc.has(a) ? fc.get(a) : null;
		if (o === null) throw new A(e.ERR_INVALID_CHAR_RANGE, a);
		return n.appendGroup(o, (this.flags & C.FOLD_CASE) !== 0), !0;
	}
	parseUnicodeClass(t, n) {
		let r = t.pos();
		if ((this.flags & C.UNICODE_GROUPS) === 0 || !t.lookingAt("\\p") && !t.lookingAt("\\P")) return !1;
		t.skip(1);
		let i = 1, a = t.pop();
		if (a === w.CODES.get("P") && (i = -1), !t.more()) throw t.rewindTo(r), new A(e.ERR_INVALID_CHAR_RANGE, t.rest());
		a = t.pop();
		let o;
		if (a !== w.CODES.get("{")) o = O.runeToString(a);
		else {
			let n = t.rest(), i = n.indexOf("}");
			if (i < 0) throw t.rewindTo(r), new A(e.ERR_INVALID_CHAR_RANGE, t.rest());
			o = n.substring(0, i), t.skipString(o), t.skip(1);
		}
		o.length !== 0 && o.codePointAt(0) === w.CODES.get("^") && (i = 0 - i, o = o.substring(1));
		let s = e.unicodeTable(o);
		if (s === null) throw new A(e.ERR_INVALID_CHAR_RANGE, t.from(r));
		s.sign < 0 && (i = 0 - i);
		let c = s.tab, l = s.fold;
		if ((this.flags & C.FOLD_CASE) === 0 || l === null) n.appendTableWithSign(c, i);
		else {
			let e = new pc().appendTable(c).appendTable(l).cleanClass().toArray();
			n.appendClassWithSign(e, i);
		}
		return !0;
	}
	parseClass(t) {
		let n = t.pos();
		t.skip(1);
		let r = this.newRegexp(M.Op.CHAR_CLASS);
		r.flags = this.flags;
		let i = new pc(), a = 1;
		t.more() && t.lookingAt("^") && (a = -1, t.skip(1), (this.flags & C.CLASS_NL) === 0 && i.appendRange(w.CODES.get("\n"), w.CODES.get("\n")));
		let o = !0;
		for (; !t.more() || t.peek() !== w.CODES.get("]") || o;) {
			if (t.more() && t.lookingAt("-") && (this.flags & C.PERL_X) === 0 && !o) {
				let r = t.rest();
				if (r === "-" || !r.startsWith("-]")) throw t.rewindTo(n), new A(e.ERR_INVALID_CHAR_RANGE, t.rest());
			}
			o = !1;
			let r = t.pos();
			if (t.lookingAt("[:")) {
				if (this.parseNamedClass(t, i)) continue;
				t.rewindTo(r);
			}
			if (this.parseUnicodeClass(t, i) || this.parsePerlClassEscape(t, i)) continue;
			t.rewindTo(r);
			let a = e.parseClassChar(t, n), s = a;
			if (t.more() && t.lookingAt("-")) {
				if (t.skip(1), t.more() && t.lookingAt("]")) t.skip(-1);
				else if (s = e.parseClassChar(t, n), s < a) throw new A(e.ERR_INVALID_CHAR_RANGE, t.from(r));
			}
			(this.flags & C.FOLD_CASE) === 0 ? i.appendRange(a, s) : i.appendFoldedRange(a, s);
		}
		t.skip(1), i.cleanClass(), a < 0 && i.negateClass(), r.runes = i.toArray(), this.push(r);
	}
}, gc = class e {
	static initTest(t) {
		let n = e.compile(t), r = new e(n.expr, n.prog, n.numSubexp, n.longest);
		return r.cond = n.cond, r.prefix = n.prefix, r.prefixUTF8 = n.prefixUTF8, r.prefixComplete = n.prefixComplete, r.prefixRune = n.prefixRune, r.prefilter = n.prefilter, r;
	}
	static compile(t) {
		return e.compileImpl(t, C.PERL, !1);
	}
	static compilePOSIX(t) {
		return e.compileImpl(t, C.POSIX, !0);
	}
	static compileImpl(t, n, r) {
		let i = hc.parse(t, n), a = i.maxCap();
		i = qs.simplify(i);
		let o = Hs.build(i), s = Ks.compileRegexp(i), c = new e(t, s, a, r);
		c.prefilter = o.type === N.Type.NONE ? null : o;
		let [l, u] = s.prefix();
		return c.prefixComplete = l, c.prefix = u, c.prefixUTF8 = O.stringToUtf8ByteArray(c.prefix), c.prefix.length > 0 && (c.prefixRune = c.prefix.codePointAt(0)), c.namedGroups = i.namedGroups, c;
	}
	static match(t, n) {
		return e.compile(t).match(n);
	}
	constructor(e, t, n = 0, r = 0) {
		this.expr = e, this.prog = t, this.numSubexp = n, this.longest = r, this.cond = t.startCond(), this.prefix = null, this.prefixUTF8 = null, this.prefixComplete = !1, this.prefixRune = 0, this.machinePool = [], this.dfa = new Es(this.prog), this.onepass = Bs.compile(this.prog), this.prefilter = null;
	}
	matchPrefixComplete(e, t, n, r) {
		if ((n === C.ANCHOR_START || n === C.ANCHOR_BOTH) && t !== 0) return null;
		let i = -1, a = -1, o = e.prefixLength(this);
		if (n === C.UNANCHORED) {
			let n = e.index(this, t);
			if (n < 0) return null;
			i = t + n, a = i + o;
		} else if (n === C.ANCHOR_BOTH) {
			if (e.endPos() !== o || e.index(this, 0) !== 0) return null;
			i = 0, a = o;
		} else if (n === C.ANCHOR_START) {
			if (e.index(this, 0) !== 0) return null;
			i = 0, a = o;
		}
		if (i < 0) return null;
		if (r > 0) {
			let e = new Int32Array(r).fill(-1);
			return e[0] = i, e[1] = a, Array.from(e);
		}
		return [];
	}
	executeEngine(e, t, n, r) {
		if (this.prefixComplete && (r === 0 || this.numSubexp === 0)) return this.matchPrefixComplete(e, t, n, r);
		if (this.prefilter !== null && n === C.UNANCHORED && !this.prefilter.eval(e, t)) return null;
		if (this.onepass !== null) return Bs.execute(this, e, t, n, r);
		if (r > 0) return this.prog.numLb === 0 && e.endPos() <= Ns.maxBitStateLen(this.prog) ? Ns.execute(this, e, t, n, r) : this.doExecuteNFA(e, t, n, r);
		if (this.prog.numLb === 0) {
			let i = this.dfa.match(e, t, n);
			if (i !== null) return i ? [] : null;
			if (e.endPos() <= Ns.maxBitStateLen(this.prog)) return Ns.execute(this, e, t, n, r);
		}
		return this.doExecuteNFA(e, t, n, r);
	}
	numberOfCapturingGroups() {
		return this.numSubexp;
	}
	numberOfInstructions() {
		return this.prog.numInst();
	}
	get() {
		return this.machinePool.length > 0 ? this.machinePool.pop() : null;
	}
	reset() {
		this.machinePool.length = 0;
	}
	put(e) {
		this.machinePool.push(e);
	}
	toString() {
		return this.expr;
	}
	doExecuteNFA(e, t, n, r) {
		let i = this.get();
		i ||= Ss.fromRE2(this), i.init(r);
		let a = i.match(e, t, n) ? i.submatches() : null;
		return this.put(i), a;
	}
	match(e) {
		return this.executeEngine(k.fromUTF16(e), 0, C.UNANCHORED, 0) !== null;
	}
	matchWithGroup(e, t, n, r, i) {
		return e instanceof cs || (e = O.isByteArray(e) ? ds.utf8(e) : ds.utf16(e)), this.matchMachineInput(e, t, n, r, i);
	}
	matchMachineInput(e, t, n, r, i) {
		if (t > n) return [!1, null];
		let a = e.isUTF16Encoding() ? k.fromUTF16(e.asCharSequence(), 0, n) : k.fromUTF8(e.asBytes(), 0, n), o = this.executeEngine(a, t, r, 2 * i);
		return o === null ? [!1, null] : [!0, o];
	}
	matchUTF8(e) {
		return this.executeEngine(k.fromUTF8(e), 0, C.UNANCHORED, 0) !== null;
	}
	replaceAll(e, t) {
		return this.replaceAllFunc(e, () => t, 2 * e.length + 1);
	}
	replaceFirst(e, t) {
		return this.replaceAllFunc(e, () => t, 1);
	}
	replaceAllFunc(e, t, n) {
		let r = 0, i = 0, a = "", o = k.fromUTF16(e), s = 0;
		for (; i <= e.length;) {
			let c = this.executeEngine(o, i, C.UNANCHORED, 2);
			if (c === null || c.length === 0) break;
			a += e.substring(r, c[0]), (c[1] > r || c[0] === 0) && (a += t(e.substring(c[0], c[1])), s++), r = c[1];
			let l = o.step(i) & 7;
			if (i + l > c[1] ? i += l : i + 1 > c[1] ? i++ : i = c[1], s >= n) break;
		}
		return a += e.substring(r), a;
	}
	pad(e) {
		if (e === null) return null;
		let t = (1 + this.numSubexp) * 2;
		if (e.length < t) {
			let n = Array(t).fill(-1);
			for (let t = 0; t < e.length; t++) n[t] = e[t];
			e = n;
		}
		return e;
	}
	allMatches(e, t, n = (e) => e) {
		let r = [], i = e.endPos();
		t < 0 && (t = i + 1);
		let a = 0, o = 0, s = -1;
		for (; o < t && a <= i;) {
			let t = this.executeEngine(e, a, C.UNANCHORED, this.prog.numCap);
			if (t === null || t.length === 0) break;
			let c = !0;
			if (t[1] === a) {
				t[0] === s && (c = !1);
				let n = e.step(a);
				n < 0 ? a = i + 1 : a += n & 7;
			} else a = t[1];
			s = t[1], c && (r.push(n(this.pad(t))), o++);
		}
		return r;
	}
	findUTF8(e) {
		let t = this.executeEngine(k.fromUTF8(e), 0, C.UNANCHORED, 2);
		return t === null ? null : e.slice(t[0], t[1]);
	}
	findUTF8Index(e) {
		let t = this.executeEngine(k.fromUTF8(e), 0, C.UNANCHORED, 2);
		return t === null ? null : t.slice(0, 2);
	}
	find(e) {
		let t = this.executeEngine(k.fromUTF16(e), 0, C.UNANCHORED, 2);
		return t === null ? "" : e.substring(t[0], t[1]);
	}
	findIndex(e) {
		return this.executeEngine(k.fromUTF16(e), 0, C.UNANCHORED, 2);
	}
	findUTF8Submatch(e) {
		let t = this.executeEngine(k.fromUTF8(e), 0, C.UNANCHORED, this.prog.numCap);
		if (t === null) return null;
		let n = Array(1 + this.numSubexp).fill(null);
		for (let r = 0; r < n.length; r++) 2 * r < t.length && t[2 * r] >= 0 && (n[r] = e.slice(t[2 * r], t[2 * r + 1]));
		return n;
	}
	findUTF8SubmatchIndex(e) {
		return this.pad(this.executeEngine(k.fromUTF8(e), 0, C.UNANCHORED, this.prog.numCap));
	}
	findSubmatch(e) {
		let t = this.executeEngine(k.fromUTF16(e), 0, C.UNANCHORED, this.prog.numCap);
		if (t === null) return null;
		let n = Array(1 + this.numSubexp).fill(null);
		for (let r = 0; r < n.length; r++) 2 * r < t.length && t[2 * r] >= 0 && (n[r] = e.substring(t[2 * r], t[2 * r + 1]));
		return n;
	}
	findSubmatchIndex(e) {
		return this.pad(this.executeEngine(k.fromUTF16(e), 0, C.UNANCHORED, this.prog.numCap));
	}
	findAllUTF8(e, t) {
		let n = this.allMatches(k.fromUTF8(e), t, (t) => e.slice(t[0], t[1]));
		return n.length === 0 ? null : n;
	}
	findAllUTF8Index(e, t) {
		let n = this.allMatches(k.fromUTF8(e), t, (e) => e.slice(0, 2));
		return n.length === 0 ? null : n;
	}
	findAll(e, t) {
		let n = this.allMatches(k.fromUTF16(e), t, (t) => e.substring(t[0], t[1]));
		return n.length === 0 ? null : n;
	}
	findAllIndex(e, t) {
		let n = this.allMatches(k.fromUTF16(e), t, (e) => e.slice(0, 2));
		return n.length === 0 ? null : n;
	}
	findAllUTF8Submatch(e, t) {
		let n = this.allMatches(k.fromUTF8(e), t, (t) => {
			let n = Array(t.length / 2 | 0).fill(null);
			for (let r = 0; r < n.length; r++) t[2 * r] >= 0 && (n[r] = e.slice(t[2 * r], t[2 * r + 1]));
			return n;
		});
		return n.length === 0 ? null : n;
	}
	findAllUTF8SubmatchIndex(e, t) {
		let n = this.allMatches(k.fromUTF8(e), t);
		return n.length === 0 ? null : n;
	}
	findAllSubmatch(e, t) {
		let n = this.allMatches(k.fromUTF16(e), t, (t) => {
			let n = Array(t.length / 2 | 0).fill(null);
			for (let r = 0; r < n.length; r++) t[2 * r] >= 0 && (n[r] = e.substring(t[2 * r], t[2 * r + 1]));
			return n;
		});
		return n.length === 0 ? null : n;
	}
	findAllSubmatchIndex(e, t) {
		let n = this.allMatches(k.fromUTF16(e), t);
		return n.length === 0 ? null : n;
	}
};
(class e {
	static UNANCHORED = C.UNANCHORED;
	static ANCHOR_START = C.ANCHOR_START;
	static ANCHOR_BOTH = C.ANCHOR_BOTH;
	constructor(t = e.UNANCHORED, n = 0, r = 8388608) {
		this.anchor = t, this.jsFlags = n, this.maxMem = r;
		let i = C.PERL;
		(n & qo.DISABLE_UNICODE_GROUPS) !== 0 && (i &= ~C.UNICODE_GROUPS), (n & qo.LOOKBEHINDS) !== 0 && (i |= C.LOOKBEHIND), this.re2Flags = i, this.regexps = [], this.prog = null, this.dfa = null, this.dummyRe2 = null;
	}
	add(e) {
		if (this.prog) throw new gs("Cannot add patterns after compile");
		let t = e;
		(this.jsFlags & qo.CASE_INSENSITIVE) !== 0 && (t = `(?i)${t}`), (this.jsFlags & qo.DOTALL) !== 0 && (t = `(?s)${t}`), (this.jsFlags & qo.MULTILINE) !== 0 && (t = `(?m)${t}`);
		let n = hc.parse(t, this.re2Flags);
		return this.regexps.push(qs.simplify(n)), this.regexps.length - 1;
	}
	compile() {
		this.prog || (this.prog = Ks.compileSet(this.regexps), this.dfa = new Es(this.prog, this.maxMem), this.dummyRe2 = {
			prog: this.prog,
			cond: this.prog.startCond(),
			prefix: "",
			prefixRune: 0,
			longest: !1
		});
	}
	match(t) {
		this.prog || this.compile();
		let n = O.isByteArray(t) ? k.fromUTF8(t) : k.fromUTF16(t), r = C.UNANCHORED;
		this.anchor === e.ANCHOR_START ? r = C.ANCHOR_START : this.anchor === e.ANCHOR_BOTH && (r = C.ANCHOR_BOTH);
		let i = this.dfa.matchSet(n, 0, r);
		if (i !== null) return i;
		let a = Ss.fromRE2(this.dummyRe2);
		return a.init(0), a.matchSet(n, 0, r);
	}
});
var _c = class e {
	static isHexadecimal(e) {
		return "0" <= e && e <= "9" || "A" <= e && e <= "F" || "a" <= e && e <= "f";
	}
	static translate(t) {
		let n = "";
		if (t instanceof RegExp && (t.ignoreCase && (n += "i"), t.multiline && (n += "m"), t.dotAll && (n += "s"), t = t.source), typeof t != "string") return t;
		let r = "", i = !1, a = t.length;
		a === 0 && (r = "(?:)", i = !0);
		let o = !1, s = 0;
		for (; s < a;) {
			let n = t[s];
			if (n === "\\") {
				if (s + 1 < a) switch (n = t[s + 1], n) {
					case "\\":
						r += "\\\\", s += 2;
						continue;
					case "c":
						if (s + 2 < a) {
							let e = t[s + 2].charCodeAt(0);
							if (e >= 65 && e <= 90 || e >= 97 && e <= 122) {
								let t = e % 32;
								r += "\\x", r += (t >> 4).toString(16).toUpperCase(), r += (t & 15).toString(16).toUpperCase(), s += 3, i = !0;
								continue;
							}
						}
						r += "c", s += 2, i = !0;
						continue;
					case "u":
						if (s + 2 < a) {
							if (t[s + 2] === "{") {
								let n = s + 3, o = !1, c = !1;
								for (; n < a;) {
									let r = t[n];
									if (r === "}") {
										c = !0;
										break;
									}
									if (!e.isHexadecimal(r)) break;
									o = !0, n++;
								}
								if (c && o) {
									r += "\\x", s += 2, i = !0;
									continue;
								}
							} else if (s + 5 < a) {
								let n = !0;
								for (let r = 0; r < 4; r++) if (!e.isHexadecimal(t[s + 2 + r])) {
									n = !1;
									break;
								}
								if (n) {
									r += "\\x{" + t.substring(s + 2, s + 6) + "}", s += 6, i = !0;
									continue;
								}
							}
						}
						r += "u", s += 2, i = !0;
						continue;
					case "x": {
						let n = !1;
						if (s + 2 < a && t[s + 2] === "{") {
							let r = s + 3, i = !1, o = !1;
							for (; r < a;) {
								let n = t[r];
								if (n === "}") {
									o = !0;
									break;
								}
								if (!e.isHexadecimal(n)) break;
								i = !0, r++;
							}
							o && i && (n = !0);
						} else s + 3 < a && e.isHexadecimal(t[s + 2]) && e.isHexadecimal(t[s + 3]) && (n = !0);
						n ? (r += "\\x", s += 2) : (r += "x", s += 2, i = !0);
						continue;
					}
					case "n":
					case "r":
					case "t":
					case "a":
					case "f":
					case "v":
					case "d":
					case "D":
					case "s":
					case "S":
					case "w":
					case "W":
					case "b":
					case "B":
					case "p":
					case "P":
					case "A":
					case "z":
					case "Q":
					case "E":
					case "0":
					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7":
						r += "\\" + n, s += 2;
						continue;
					default: {
						let e = t.codePointAt(s + 1);
						if (e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122) {
							let n = O.charCount(e);
							r += t.substring(s + 1, s + 1 + n), s += n + 1, i = !0;
						} else {
							r += "\\";
							let n = O.charCount(e);
							r += t.substring(s + 1, s + 1 + n), s += n + 1;
						}
						continue;
					}
				}
			} else if (n === "/") {
				r += "\\/", s += 1, i = !0;
				continue;
			} else if (n === "[") o = !0;
			else if (n === "]") o = !1;
			else if (!o && n === "(" && s + 2 < a && t[s + 1] === "?" && t[s + 2] === "<" && s + 3 < a && !"=!>)".includes(t[s + 3])) {
				r += "(?P<", s += 3, i = !0;
				continue;
			}
			let c = t.codePointAt(s), l = O.charCount(c);
			r += t.substring(s, s + l), s += l;
		}
		let c = i ? r : t;
		return n.length > 0 ? `(?${n})${c}` : c;
	}
}, vc = class e {
	static CASE_INSENSITIVE = qo.CASE_INSENSITIVE;
	static DOTALL = qo.DOTALL;
	static MULTILINE = qo.MULTILINE;
	static DISABLE_UNICODE_GROUPS = qo.DISABLE_UNICODE_GROUPS;
	static LONGEST_MATCH = qo.LONGEST_MATCH;
	static LOOKBEHINDS = qo.LOOKBEHINDS;
	static quote(e) {
		return O.quoteMeta(e);
	}
	static quoteReplacement(e, t = !1) {
		return bs.quoteReplacement(e, t);
	}
	static translateRegExp(e) {
		return _c.translate(e);
	}
	static compile(t, n = 0) {
		let r = t;
		if ((n & e.CASE_INSENSITIVE) !== 0 && (r = `(?i)${r}`), (n & e.DOTALL) !== 0 && (r = `(?s)${r}`), (n & e.MULTILINE) !== 0 && (r = `(?m)${r}`), (n & ~(e.MULTILINE | e.DOTALL | e.CASE_INSENSITIVE | e.DISABLE_UNICODE_GROUPS | e.LONGEST_MATCH | e.LOOKBEHINDS)) !== 0) throw new vs("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");
		let i = C.PERL;
		(n & e.DISABLE_UNICODE_GROUPS) !== 0 && (i &= ~C.UNICODE_GROUPS), (n & e.LOOKBEHINDS) !== 0 && (i |= C.LOOKBEHIND);
		let a = new e(t, n);
		return a.re2Input = gc.compileImpl(r, i, (n & e.LONGEST_MATCH) !== 0), a;
	}
	static matches(t, n) {
		return e.compile(t).testExact(n);
	}
	static initTest(t, n, r) {
		if (t == null) throw Error("pattern is null");
		if (r == null) throw Error("re2 is null");
		let i = new e(t, n);
		return i.re2Input = r, i;
	}
	constructor(e, t) {
		this.patternInput = e, this.flagsInput = t, this.re2Input = null;
	}
	reset() {
		this.re2Input.reset();
	}
	flags() {
		return this.flagsInput;
	}
	pattern() {
		return this.patternInput;
	}
	re2() {
		return this.re2Input;
	}
	matches(e) {
		return this.testExact(e);
	}
	matcher(e) {
		return O.isByteArray(e) && (e = ds.utf8(e)), new bs(this, e);
	}
	test(e) {
		return O.isByteArray(e) ? this.re2Input.matchUTF8(e) : this.re2Input.match(e);
	}
	testExact(e) {
		let t = O.isByteArray(e) ? k.fromUTF8(e) : k.fromUTF16(e);
		return this.re2Input.executeEngine(t, 0, C.ANCHOR_BOTH, 0) !== null;
	}
	exec(e) {
		let t = this.matcher(e);
		if (!t.find()) return null;
		let n = [t.group(0)];
		for (let e = 1; e <= t.groupCount(); e++) {
			let r = t.group(e);
			n.push(r === null ? void 0 : r);
		}
		n.index = t.start(0), n.input = e;
		let r = this.namedGroups();
		if (Object.keys(r).length > 0) {
			let e = t.getNamedGroups();
			for (let t in e) e[t] === null && (e[t] = void 0);
			n.groups = e;
		} else n.groups = void 0;
		return n;
	}
	split(e, t = 0) {
		let n = this.matcher(e), r = [], i = 0, a = 0;
		for (; n.find();) {
			if (a === 0 && n.end() === 0) {
				a = n.end();
				continue;
			}
			if (t > 0 && r.length === t - 1) break;
			if (a === n.start()) {
				if (t === 0) {
					i += 1, a = n.end();
					continue;
				}
			} else for (; i > 0;) r.push(""), --i;
			r.push(n.substring(a, n.start())), a = n.end();
		}
		if (t === 0 && a !== n.inputLength()) {
			for (; i > 0;) r.push(""), --i;
			r.push(n.substring(a, n.inputLength()));
		}
		return (t !== 0 || r.length === 0 && !(a === n.inputLength() && a > 0)) && r.push(n.substring(a, n.inputLength())), r;
	}
	*matchAll(e) {
		let t = this.matcher(e);
		for (; t.find();) {
			let n = [t.group(0)];
			for (let e = 1; e <= t.groupCount(); e++) {
				let r = t.group(e);
				n.push(r === null ? void 0 : r);
			}
			n.index = t.start(0), n.input = e;
			let r = this.namedGroups();
			if (Object.keys(r).length > 0) {
				let e = t.getNamedGroups();
				for (let t in e) e[t] === null && (e[t] = void 0);
				n.groups = e;
			} else n.groups = void 0;
			yield n;
		}
	}
	toString() {
		return this.patternInput;
	}
	programSize() {
		return this.re2Input.numberOfInstructions();
	}
	groupCount() {
		return this.re2Input.numberOfCapturingGroups();
	}
	namedGroups() {
		return this.re2Input.namedGroups;
	}
	equals(e) {
		return this === e ? !0 : e === null || this.constructor !== e.constructor ? !1 : this.flagsInput === e.flagsInput && this.patternInput === e.patternInput;
	}
}, yc = "12.19.0";
function bc(e) {
	yc = e;
}
var xc = new Re("@firebase/firestore");
function Sc() {
	return xc.logLevel;
}
function F(e, ...t) {
	if (xc.logLevel <= y.DEBUG) {
		let n = t.map(Tc);
		xc.debug(`Firestore (${yc}): ${e}`, ...n);
	}
}
function Cc(e, ...t) {
	if (xc.logLevel <= y.ERROR) {
		let n = t.map(Tc);
		xc.error(`Firestore (${yc}): ${e}`, ...n);
	}
}
function wc(e, ...t) {
	if (xc.logLevel <= y.WARN) {
		let n = t.map(Tc);
		xc.warn(`Firestore (${yc}): ${e}`, ...n);
	}
}
function Tc(e) {
	if (typeof e == "string") return e;
	try {
		return function(e) {
			return JSON.stringify(e);
		}(e);
	} catch {
		return e;
	}
}
function I(e, t, n) {
	let r = "Unexpected state";
	typeof t == "string" ? r = t : n = t, Ec(e, r, n);
}
function Ec(e, t, n) {
	let r = `FIRESTORE (${yc}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;
	if (n !== void 0) try {
		r += " CONTEXT: " + JSON.stringify(n);
	} catch {
		r += " CONTEXT: " + n;
	}
	throw Cc(r), Error(r);
}
function L(e, t, n, r) {
	let i = "Unexpected state";
	typeof n == "string" ? i = n : r = n, e || Ec(t, i, r);
}
function R(e, t) {
	return e;
}
function Dc(e) {
	let t = typeof self < "u" && (self.crypto || self.msCrypto), n = new Uint8Array(e);
	if (t && typeof t.getRandomValues == "function") t.getRandomValues(n);
	else for (let t = 0; t < e; t++) n[t] = Math.floor(256 * Math.random());
	return n;
}
var Oc = class {
	static newId() {
		let e = "";
		for (; e.length < 20;) {
			let t = Dc(40);
			for (let n = 0; n < t.length; ++n) e.length < 20 && t[n] < 248 && (e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(t[n] % 62));
		}
		return e;
	}
};
function z(e, t) {
	return e < t ? -1 : +(e > t);
}
function kc(e, t) {
	let n = Math.min(e.length, t.length);
	for (let r = 0; r < n; r++) {
		let n = e.charAt(r), i = t.charAt(r);
		if (n !== i) return Mc(n) === Mc(i) ? z(n, i) : Mc(n) ? 1 : -1;
	}
	return z(e.length, t.length);
}
var Ac = 55296, jc = 57343;
function Mc(e) {
	let t = e.charCodeAt(0);
	return t >= Ac && t <= jc;
}
function Nc(e, t, n) {
	return e.length === t.length && e.every(((e, r) => n(e, t[r])));
}
var Pc = class e {
	constructor(e, t) {
		this.comparator = e, this.root = t || Ic.EMPTY;
	}
	insert(t, n) {
		return new e(this.comparator, this.root.insert(t, n, this.comparator).copy(null, null, Ic.BLACK, null, null));
	}
	remove(t) {
		return new e(this.comparator, this.root.remove(t, this.comparator).copy(null, null, Ic.BLACK, null, null));
	}
	get(e) {
		let t = this.root;
		for (; !t.isEmpty();) {
			let n = this.comparator(e, t.key);
			if (n === 0) return t.value;
			n < 0 ? t = t.left : n > 0 && (t = t.right);
		}
		return null;
	}
	indexOf(e) {
		let t = 0, n = this.root;
		for (; !n.isEmpty();) {
			let r = this.comparator(e, n.key);
			if (r === 0) return t + n.left.size;
			r < 0 ? n = n.left : (t += n.left.size + 1, n = n.right);
		}
		return -1;
	}
	isEmpty() {
		return this.root.isEmpty();
	}
	get size() {
		return this.root.size;
	}
	minKey() {
		return this.root.minKey();
	}
	maxKey() {
		return this.root.maxKey();
	}
	inorderTraversal(e) {
		return this.root.inorderTraversal(e);
	}
	forEach(e) {
		this.inorderTraversal(((t, n) => (e(t, n), !1)));
	}
	toString() {
		let e = [];
		return this.inorderTraversal(((t, n) => (e.push(`${t}:${n}`), !1))), `{${e.join(", ")}}`;
	}
	reverseTraversal(e) {
		return this.root.reverseTraversal(e);
	}
	getIterator() {
		return new Fc(this.root, null, this.comparator, !1);
	}
	getIteratorFrom(e) {
		return new Fc(this.root, e, this.comparator, !1);
	}
	getReverseIterator() {
		return new Fc(this.root, null, this.comparator, !0);
	}
	getReverseIteratorFrom(e) {
		return new Fc(this.root, e, this.comparator, !0);
	}
}, Fc = class {
	constructor(e, t, n, r) {
		this.isReverse = r, this.nodeStack = [];
		let i = 1;
		for (; !e.isEmpty();) if (i = t ? n(e.key, t) : 1, t && r && (i *= -1), i < 0) e = this.isReverse ? e.left : e.right;
		else {
			if (i === 0) {
				this.nodeStack.push(e);
				break;
			}
			this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
		}
	}
	getNext() {
		let e = this.nodeStack.pop(), t = {
			key: e.key,
			value: e.value
		};
		if (this.isReverse) for (e = e.left; !e.isEmpty();) this.nodeStack.push(e), e = e.right;
		else for (e = e.right; !e.isEmpty();) this.nodeStack.push(e), e = e.left;
		return t;
	}
	hasNext() {
		return this.nodeStack.length > 0;
	}
	peek() {
		if (this.nodeStack.length === 0) return null;
		let e = this.nodeStack[this.nodeStack.length - 1];
		return {
			key: e.key,
			value: e.value
		};
	}
}, Ic = class e {
	constructor(t, n, r, i, a) {
		this.key = t, this.value = n, this.color = r ?? e.RED, this.left = i ?? e.EMPTY, this.right = a ?? e.EMPTY, this.size = this.left.size + 1 + this.right.size;
	}
	copy(t, n, r, i, a) {
		return new e(t ?? this.key, n ?? this.value, r ?? this.color, i ?? this.left, a ?? this.right);
	}
	isEmpty() {
		return !1;
	}
	inorderTraversal(e) {
		return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
	}
	reverseTraversal(e) {
		return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
	}
	min() {
		return this.left.isEmpty() ? this : this.left.min();
	}
	minKey() {
		return this.min().key;
	}
	maxKey() {
		return this.right.isEmpty() ? this.key : this.right.maxKey();
	}
	insert(e, t, n) {
		let r = this, i = n(e, r.key);
		return r = i < 0 ? r.copy(null, null, null, r.left.insert(e, t, n), null) : i === 0 ? r.copy(null, t, null, null, null) : r.copy(null, null, null, null, r.right.insert(e, t, n)), r.fixUp();
	}
	removeMin() {
		if (this.left.isEmpty()) return e.EMPTY;
		let t = this;
		return t.left.isRed() || t.left.left.isRed() || (t = t.moveRedLeft()), t = t.copy(null, null, null, t.left.removeMin(), null), t.fixUp();
	}
	remove(t, n) {
		let r, i = this;
		if (n(t, i.key) < 0) i.left.isEmpty() || i.left.isRed() || i.left.left.isRed() || (i = i.moveRedLeft()), i = i.copy(null, null, null, i.left.remove(t, n), null);
		else {
			if (i.left.isRed() && (i = i.rotateRight()), i.right.isEmpty() || i.right.isRed() || i.right.left.isRed() || (i = i.moveRedRight()), n(t, i.key) === 0) {
				if (i.right.isEmpty()) return e.EMPTY;
				r = i.right.min(), i = i.copy(r.key, r.value, null, null, i.right.removeMin());
			}
			i = i.copy(null, null, null, null, i.right.remove(t, n));
		}
		return i.fixUp();
	}
	isRed() {
		return this.color;
	}
	fixUp() {
		let e = this;
		return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
	}
	moveRedLeft() {
		let e = this.colorFlip();
		return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
	}
	moveRedRight() {
		let e = this.colorFlip();
		return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
	}
	rotateLeft() {
		let t = this.copy(null, null, e.RED, null, this.right.left);
		return this.right.copy(null, null, this.color, t, null);
	}
	rotateRight() {
		let t = this.copy(null, null, e.RED, this.left.right, null);
		return this.left.copy(null, null, this.color, null, t);
	}
	colorFlip() {
		let e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
		return this.copy(null, null, !this.color, e, t);
	}
	checkMaxDepth() {
		return 2 ** this.check() <= this.size + 1;
	}
	check() {
		if (this.isRed() && this.left.isRed()) throw I(43730, {
			key: this.key,
			value: this.value
		});
		if (this.right.isRed()) throw I(14113, {
			key: this.key,
			value: this.value
		});
		let e = this.left.check();
		if (e !== this.right.check()) throw I(27949);
		return e + +!this.isRed();
	}
};
Ic.EMPTY = null, Ic.RED = !0, Ic.BLACK = !1, Ic.EMPTY = new class {
	constructor() {
		this.size = 0;
	}
	get key() {
		throw I(57766);
	}
	get value() {
		throw I(16141);
	}
	get color() {
		throw I(16727);
	}
	get left() {
		throw I(29726);
	}
	get right() {
		throw I(36894);
	}
	copy(e, t, n, r, i) {
		return this;
	}
	insert(e, t, n) {
		return new Ic(e, t);
	}
	remove(e, t) {
		return this;
	}
	isEmpty() {
		return !0;
	}
	inorderTraversal(e) {
		return !1;
	}
	reverseTraversal(e) {
		return !1;
	}
	minKey() {
		return null;
	}
	maxKey() {
		return null;
	}
	isRed() {
		return !1;
	}
	checkMaxDepth() {
		return !0;
	}
	check() {
		return 0;
	}
}();
var Lc = class e {
	constructor(e) {
		this.comparator = e, this.data = new Pc(this.comparator);
	}
	has(e) {
		return this.data.get(e) !== null;
	}
	first() {
		return this.data.minKey();
	}
	last() {
		return this.data.maxKey();
	}
	get size() {
		return this.data.size;
	}
	indexOf(e) {
		return this.data.indexOf(e);
	}
	forEach(e) {
		this.data.inorderTraversal(((t, n) => (e(t), !1)));
	}
	forEachInRange(e, t) {
		let n = this.data.getIteratorFrom(e[0]);
		for (; n.hasNext();) {
			let r = n.getNext();
			if (this.comparator(r.key, e[1]) >= 0) return;
			t(r.key);
		}
	}
	forEachWhile(e, t) {
		let n;
		for (n = t === void 0 ? this.data.getIterator() : this.data.getIteratorFrom(t); n.hasNext();) if (!e(n.getNext().key)) return;
	}
	firstAfterOrEqual(e) {
		let t = this.data.getIteratorFrom(e);
		return t.hasNext() ? t.getNext().key : null;
	}
	getIterator() {
		return new Rc(this.data.getIterator());
	}
	getIteratorFrom(e) {
		return new Rc(this.data.getIteratorFrom(e));
	}
	add(e) {
		return this.copy(this.data.remove(e).insert(e, !0));
	}
	delete(e) {
		return this.has(e) ? this.copy(this.data.remove(e)) : this;
	}
	isEmpty() {
		return this.data.isEmpty();
	}
	unionWith(e) {
		let t = this;
		return t.size < e.size && (t = e, e = this), e.forEach(((e) => {
			t = t.add(e);
		})), t;
	}
	isEqual(t) {
		if (!(t instanceof e) || this.size !== t.size) return !1;
		let n = this.data.getIterator(), r = t.data.getIterator();
		for (; n.hasNext();) {
			let e = n.getNext().key, t = r.getNext().key;
			if (this.comparator(e, t) !== 0) return !1;
		}
		return !0;
	}
	toArray() {
		let e = [];
		return this.forEach(((t) => {
			e.push(t);
		})), e;
	}
	toString() {
		let e = [];
		return this.forEach(((t) => e.push(t))), "SortedSet(" + e.toString() + ")";
	}
	copy(t) {
		let n = new e(this.comparator);
		return n.data = t, n;
	}
}, Rc = class {
	constructor(e) {
		this.iter = e;
	}
	getNext() {
		return this.iter.getNext().key;
	}
	hasNext() {
		return this.iter.hasNext();
	}
}, B = {
	OK: "ok",
	CANCELLED: "cancelled",
	UNKNOWN: "unknown",
	INVALID_ARGUMENT: "invalid-argument",
	DEADLINE_EXCEEDED: "deadline-exceeded",
	NOT_FOUND: "not-found",
	ALREADY_EXISTS: "already-exists",
	PERMISSION_DENIED: "permission-denied",
	UNAUTHENTICATED: "unauthenticated",
	RESOURCE_EXHAUSTED: "resource-exhausted",
	FAILED_PRECONDITION: "failed-precondition",
	ABORTED: "aborted",
	OUT_OF_RANGE: "out-of-range",
	UNIMPLEMENTED: "unimplemented",
	INTERNAL: "internal",
	UNAVAILABLE: "unavailable",
	DATA_LOSS: "data-loss"
}, V = class extends de {
	constructor(e, t) {
		super(e, t), this.code = e, this.message = t, this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
	}
}, zc = "__name__", Bc = class e {
	constructor(e, t, n) {
		t === void 0 ? t = 0 : t > e.length && I(637, {
			offset: t,
			range: e.length
		}), n === void 0 ? n = e.length - t : n > e.length - t && I(1746, {
			length: n,
			range: e.length - t
		}), this.segments = e, this.offset = t, this.len = n;
	}
	get length() {
		return this.len;
	}
	isEqual(t) {
		return e.comparator(this, t) === 0;
	}
	child(t) {
		let n = this.segments.slice(this.offset, this.limit());
		return t instanceof e ? t.forEach(((e) => {
			n.push(e);
		})) : n.push(t), this.construct(n);
	}
	limit() {
		return this.offset + this.length;
	}
	popFirst(e) {
		return e = e === void 0 ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
	}
	popLast() {
		return this.construct(this.segments, this.offset, this.length - 1);
	}
	firstSegment() {
		return this.segments[this.offset];
	}
	lastSegment() {
		return this.get(this.length - 1);
	}
	get(e) {
		return this.segments[this.offset + e];
	}
	isEmpty() {
		return this.length === 0;
	}
	isPrefixOf(e) {
		if (e.length < this.length) return !1;
		for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
		return !0;
	}
	isImmediateParentOf(e) {
		if (this.length + 1 !== e.length) return !1;
		for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
		return !0;
	}
	forEach(e) {
		for (let t = this.offset, n = this.limit(); t < n; t++) e(this.segments[t]);
	}
	toArray() {
		return this.segments.slice(this.offset, this.limit());
	}
	static comparator(t, n) {
		let r = Math.min(t.length, n.length);
		for (let i = 0; i < r; i++) {
			let r = e.compareSegments(t.get(i), n.get(i));
			if (r !== 0) return r;
		}
		return z(t.length, n.length);
	}
	static compareSegments(t, n) {
		let r = e.isNumericId(t), i = e.isNumericId(n);
		return r && !i ? -1 : !r && i ? 1 : r && i ? e.extractNumericId(t).compare(e.extractNumericId(n)) : kc(t, n);
	}
	static isNumericId(e) {
		return e.startsWith("__id") && e.endsWith("__");
	}
	static extractNumericId(e) {
		return Io.fromString(e.substring(4, e.length - 2));
	}
}, H = class e extends Bc {
	construct(t, n, r) {
		return new e(t, n, r);
	}
	canonicalString() {
		return this.toArray().join("/");
	}
	toString() {
		return this.canonicalString();
	}
	toStringWithLeadingSlash() {
		return `/${this.canonicalString()}`;
	}
	toUriEncodedString() {
		return this.toArray().map(encodeURIComponent).join("/");
	}
	static fromString(...t) {
		let n = [];
		for (let e of t) {
			if (e.indexOf("//") >= 0) throw new V(B.INVALID_ARGUMENT, `Invalid segment (${e}). Paths must not contain // in them.`);
			n.push(...e.split("/").filter(((e) => e.length > 0)));
		}
		return new e(n);
	}
	static emptyPath() {
		return new e([]);
	}
}, Vc = /^[_a-zA-Z][_a-zA-Z0-9]*$/, Hc = class e extends Bc {
	construct(t, n, r) {
		return new e(t, n, r);
	}
	static isValidIdentifier(e) {
		return Vc.test(e);
	}
	canonicalString() {
		return this.toArray().map(((t) => (t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), e.isValidIdentifier(t) || (t = "`" + t + "`"), t))).join(".");
	}
	toString() {
		return this.canonicalString();
	}
	isKeyField() {
		return this.length === 1 && this.get(0) === zc;
	}
	static keyField() {
		return new e([zc]);
	}
	static fromServerFormat(t) {
		let n = [], r = "", i = 0, a = () => {
			if (r.length === 0) throw new V(B.INVALID_ARGUMENT, `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
			n.push(r), r = "";
		}, o = !1;
		for (; i < t.length;) {
			let e = t[i];
			if (e === "\\") {
				if (i + 1 === t.length) throw new V(B.INVALID_ARGUMENT, "Path has trailing escape character: " + t);
				let e = t[i + 1];
				if (e !== "\\" && e !== "." && e !== "`") throw new V(B.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t);
				r += e, i += 2;
			} else e === "`" ? (o = !o, i++) : e !== "." || o ? (r += e, i++) : (a(), i++);
		}
		if (a(), o) throw new V(B.INVALID_ARGUMENT, "Unterminated ` in path: " + t);
		return new e(n);
	}
	static emptyPath() {
		return new e([]);
	}
}, Uc = class e {
	constructor(e) {
		this.fields = e, e.sort(Hc.comparator);
	}
	static empty() {
		return new e([]);
	}
	unionWith(t) {
		let n = new Lc(Hc.comparator);
		for (let e of this.fields) n = n.add(e);
		for (let e of t) n = n.add(e);
		return new e(n.toArray());
	}
	covers(e) {
		for (let t of this.fields) if (t.isPrefixOf(e)) return !0;
		return !1;
	}
	isEqual(e) {
		return Nc(this.fields, e.fields, ((e, t) => e.isEqual(t)));
	}
};
function Wc(e) {
	let t = 0;
	for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t++;
	return t;
}
function Gc(e, t) {
	for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
}
function Kc(e, t) {
	let n = [];
	for (let r in e) Object.prototype.hasOwnProperty.call(e, r) && n.push(t(e[r], r, e));
	return n;
}
function qc(e) {
	for (let t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
	return !0;
}
var U = class e {
	constructor(e) {
		this.path = e;
	}
	static fromPath(t) {
		return new e(H.fromString(t));
	}
	static fromName(t) {
		return new e(H.fromString(t).popFirst(5));
	}
	static empty() {
		return new e(H.emptyPath());
	}
	get collectionGroup() {
		return this.path.popLast().lastSegment();
	}
	hasCollectionId(e) {
		return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
	}
	getCollectionGroup() {
		return this.path.get(this.path.length - 2);
	}
	getCollectionPath() {
		return this.path.popLast();
	}
	isEqual(e) {
		return e !== null && H.comparator(this.path, e.path) === 0;
	}
	toString() {
		return this.path.toString();
	}
	static comparator(e, t) {
		return H.comparator(e.path, t.path);
	}
	static isDocumentKey(e) {
		return e.length % 2 == 0;
	}
	static fromSegments(t) {
		return new e(new H(t.slice()));
	}
};
function Jc(e, t, n) {
	if (!n) throw new V(B.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
}
function Yc(e, t, n, r) {
	if (!0 === t && !0 === r) throw new V(B.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
}
function Xc(e) {
	if (!U.isDocumentKey(e)) throw new V(B.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
}
function Zc(e) {
	if (U.isDocumentKey(e)) throw new V(B.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
}
function Qc(e) {
	return typeof e == "object" && !!e && (Object.getPrototypeOf(e) === Object.prototype || Object.getPrototypeOf(e) === null);
}
function $c(e) {
	if (e === void 0) return "undefined";
	if (e === null) return "null";
	if (typeof e == "string") return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
	if (typeof e == "number" || typeof e == "boolean") return "" + e;
	if (typeof e == "object") {
		if (e instanceof Array) return "an array";
		{
			let t = function(e) {
				return e.constructor ? e.constructor.name : null;
			}(e);
			return t ? `a custom ${t} object` : "an object";
		}
	}
	return typeof e == "function" ? "a function" : I(12329, { type: typeof e });
}
function el(e, t) {
	if ("_delegate" in e && (e = e._delegate), !(e instanceof t)) {
		if (t.name === e.constructor.name) throw new V(B.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
		{
			let n = $c(e);
			throw new V(B.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
		}
	}
	return e;
}
function W(e, t) {
	let n = { typeString: e };
	return t && (n.value = t), n;
}
function tl(e, t) {
	if (!Qc(e)) throw new V(B.INVALID_ARGUMENT, "JSON must be an object");
	let n;
	for (let r in t) if (t[r]) {
		let i = t[r].typeString, a = "value" in t[r] ? { value: t[r].value } : void 0;
		if (!(r in e)) {
			n = `JSON missing required field: '${r}'`;
			break;
		}
		let o = e[r];
		if (i && typeof o !== i) {
			n = `JSON field '${r}' must be a ${i}.`;
			break;
		}
		if (a !== void 0 && o !== a.value) {
			n = `Expected '${r}' field to equal '${a.value}'`;
			break;
		}
	}
	if (n) throw new V(B.INVALID_ARGUMENT, n);
	return !0;
}
var nl = -62135596800, rl = 1e6, G = class e {
	static now() {
		return e.fromMillis(Date.now());
	}
	static fromDate(t) {
		return e.fromMillis(t.getTime());
	}
	static fromMillis(t) {
		let n = Math.floor(t / 1e3), r = Math.floor((t - 1e3 * n) * rl);
		return new e(n, r);
	}
	static fromInstant(t) {
		if (!t || typeof t.t != "bigint") throw new V(B.INVALID_ARGUMENT, "Invalid Temporal.Instant object provided.");
		return e._fromEpochNanoseconds(t.t);
	}
	static _fromEpochNanoseconds(t) {
		let n, r;
		if (t >= 0n) n = Number(t / 1000000000n), r = Number(t % 1000000000n);
		else {
			let e = t % 1000000000n;
			e === 0n ? (n = Number(t / 1000000000n), r = 0) : (n = Number(t / 1000000000n - 1n), r = Number(e + 1000000000n));
		}
		return new e(n, r);
	}
	constructor(e, t) {
		if (this.seconds = e, this.nanoseconds = t, t < 0 || t >= 1e9) throw new V(B.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
		if (e < nl || e >= 253402300800) throw new V(B.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
	}
	toDate() {
		return new Date(this.toMillis());
	}
	toMillis() {
		return 1e3 * this.seconds + this.nanoseconds / rl;
	}
	toInstant() {
		if (typeof Temporal > "u" || !Temporal.Instant) throw new V(B.FAILED_PRECONDITION, "The Temporal object is not available in the current environment.");
		let e = 1000000000n * BigInt(this.seconds) + BigInt(this.nanoseconds);
		return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e);
	}
	_compareTo(e) {
		return this.seconds === e.seconds ? z(this.nanoseconds, e.nanoseconds) : z(this.seconds, e.seconds);
	}
	isEqual(e) {
		return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
	}
	toString() {
		return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
	}
	toJSON() {
		return {
			type: e._jsonSchemaVersion,
			seconds: this.seconds,
			nanoseconds: this.nanoseconds
		};
	}
	static fromJSON(t) {
		if (tl(t, e._jsonSchema)) return new e(t.seconds, t.nanoseconds);
	}
	valueOf() {
		let e = this.seconds - nl;
		return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
	}
};
G._jsonSchemaVersion = "firestore/timestamp/1.0", G._jsonSchema = {
	type: W("string", G._jsonSchemaVersion),
	seconds: W("number"),
	nanoseconds: W("number")
};
var il = class extends Error {
	constructor() {
		super(...arguments), this.name = "Base64DecodeError";
	}
}, al = class e {
	constructor(e) {
		this.binaryString = e;
	}
	static fromBase64String(t) {
		let n = function(e) {
			try {
				return atob(e);
			} catch (e) {
				throw typeof DOMException < "u" && e instanceof DOMException ? new il("Invalid base64 string: " + e) : e;
			}
		}(t);
		return new e(n);
	}
	static fromUint8Array(t) {
		let n = function(e) {
			let t = "";
			for (let n = 0; n < e.length; ++n) t += String.fromCharCode(e[n]);
			return t;
		}(t);
		return new e(n);
	}
	[Symbol.iterator]() {
		let e = 0;
		return { next: () => e < this.binaryString.length ? {
			value: this.binaryString.charCodeAt(e++),
			done: !1
		} : {
			value: void 0,
			done: !0
		} };
	}
	toBase64() {
		return function(e) {
			return btoa(e);
		}(this.binaryString);
	}
	toUint8Array() {
		return function(e) {
			let t = new Uint8Array(e.length);
			for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
			return t;
		}(this.binaryString);
	}
	approximateByteSize() {
		return 2 * this.binaryString.length;
	}
	compareTo(e) {
		return z(this.binaryString, e.binaryString);
	}
	isEqual(e) {
		return this.binaryString === e.binaryString;
	}
};
al.EMPTY_BYTE_STRING = new al("");
var ol = /* @__PURE__ */ new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
function sl(e) {
	if (L(!!e, 39018), typeof e == "string") {
		let t = 0, n = ol.exec(e);
		if (L(!!n, 46558, { timestamp: e }), n[1]) {
			let e = n[1];
			e = (e + "000000000").substr(0, 9), t = Number(e);
		}
		let r = new Date(e);
		return {
			seconds: Math.floor(r.getTime() / 1e3),
			nanos: t
		};
	}
	return {
		seconds: K(e.seconds),
		nanos: K(e.nanos)
	};
}
function K(e) {
	return typeof e == "number" ? e : typeof e == "string" ? Number(e) : 0;
}
function cl(e) {
	return typeof e == "string" ? al.fromBase64String(e) : al.fromUint8Array(e);
}
var ll = "server_timestamp", ul = "__type__", dl = "__previous_value__", fl = "__local_write_time__";
function pl(e) {
	return (e?.mapValue?.fields || {})[ul]?.stringValue === ll;
}
function ml(e) {
	let t = e.mapValue.fields[dl];
	return pl(t) ? ml(t) : t;
}
function hl(e) {
	let t = sl(e.mapValue.fields[fl].timestampValue);
	return new G(t.seconds, t.nanos);
}
var gl = class {
	constructor(e, t, n, r, i, a, o, s, c, l, u, d, f) {
		this.databaseId = e, this.appId = t, this.persistenceKey = n, this.host = r, this.ssl = i, this.forceLongPolling = a, this.autoDetectLongPolling = o, this.longPollingOptions = s, this.useFetchStreams = c, this.isUsingEmulator = l, this.apiKey = u, this._customHeaders = d, this.grpcFlowControlWindow = f;
	}
}, _l = "(default)", vl = class e {
	constructor(e, t) {
		this.projectId = e, this.database = t || _l;
	}
	static empty() {
		return new e("", "");
	}
	get isDefaultDatabase() {
		return this.database === _l;
	}
	isEqual(t) {
		return t instanceof e && t.projectId === this.projectId && t.database === this.database;
	}
};
function yl(e, t) {
	if (!Object.prototype.hasOwnProperty.apply(e.options, ["projectId"])) throw new V(B.INVALID_ARGUMENT, "\"projectId\" not provided in firebase.initializeApp.");
	return new vl(e.options.projectId, t);
}
var bl = -1;
function xl(e) {
	return e == null;
}
function Sl(e) {
	return e === 0 && 1 / e == -1 / 0;
}
function Cl(e) {
	return typeof e == "number" && Number.isInteger(e) && !Sl(e) && e <= 2 ** 53 - 1 && e >= -(2 ** 53 - 1);
}
function wl(e) {
	return typeof e == "string";
}
var Tl = "__type__", El = "__max__", Dl = { mapValue: { fields: { __type__: { stringValue: El } } } }, Ol = "__vector__", kl = "value", Al = { nullValue: "NULL_VALUE" }, jl = { booleanValue: !0 }, Ml = { booleanValue: !1 };
function Nl(e) {
	return "nullValue" in e ? 0 : "booleanValue" in e ? 1 : "integerValue" in e || "doubleValue" in e ? 2 : "timestampValue" in e ? 3 : "stringValue" in e ? 5 : "bytesValue" in e ? 6 : "referenceValue" in e ? 7 : "geoPointValue" in e ? 8 : "arrayValue" in e ? 9 : "mapValue" in e ? pl(e) ? 4 : Ql(e) ? 9007199254740991 : Yl(e) ? 10 : 11 : I(28295, { value: e });
}
function Pl(e, t, n) {
	if (e === t) return !0;
	let r = Nl(e);
	if (r !== Nl(t)) return !1;
	switch (r) {
		case 0:
		case 9007199254740991: return !0;
		case 1: return e.booleanValue === t.booleanValue;
		case 4: return hl(e).isEqual(hl(t));
		case 3: return function(e, t) {
			if (typeof e.timestampValue == "string" && typeof t.timestampValue == "string" && e.timestampValue.length === t.timestampValue.length) return e.timestampValue === t.timestampValue;
			let n = sl(e.timestampValue), r = sl(t.timestampValue);
			return n.seconds === r.seconds && n.nanos === r.nanos;
		}(e, t);
		case 5: return e.stringValue === t.stringValue;
		case 6: return function(e, t) {
			return cl(e.bytesValue).isEqual(cl(t.bytesValue));
		}(e, t);
		case 7: return e.referenceValue === t.referenceValue;
		case 8: return function(e, t) {
			return K(e.geoPointValue.latitude) === K(t.geoPointValue.latitude) && K(e.geoPointValue.longitude) === K(t.geoPointValue.longitude);
		}(e, t);
		case 2: return function(e, t, n) {
			if ("integerValue" in e && "integerValue" in t) return K(e.integerValue) === K(t.integerValue);
			let r, i;
			if ("doubleValue" in e && "doubleValue" in t) r = K(e.doubleValue), i = K(t.doubleValue);
			else {
				if (!n?.i) return !1;
				r = K(e.integerValue ?? e.doubleValue), i = K(t.integerValue ?? t.doubleValue);
			}
			return r === i ? !!n?.o || Sl(r) === Sl(i) : !!(n === void 0 || n.u) && isNaN(r) && isNaN(i);
		}(e, t, n);
		case 9: return Nc(e.arrayValue.values || [], t.arrayValue.values || [], ((e, t) => Pl(e, t, n)));
		case 10:
		case 11: return function(e, t, n) {
			let r = e.mapValue.fields || {}, i = t.mapValue.fields || {};
			if (Wc(r) !== Wc(i)) return !1;
			for (let e in r) if (r.hasOwnProperty(e) && (i[e] === void 0 || !Pl(r[e], i[e], n))) return !1;
			return !0;
		}(e, t, n);
		default: return I(52216, { left: e });
	}
}
function Fl(e, t) {
	return (e.values || []).find(((e) => Pl(e, t))) !== void 0;
}
function Il(e, t) {
	if (e === t) return 0;
	let n = Nl(e), r = Nl(t);
	if (n !== r) return z(n, r);
	switch (n) {
		case 0:
		case 9007199254740991: return 0;
		case 1: return z(e.booleanValue, t.booleanValue);
		case 2: return function(e, t) {
			let n = K(e.integerValue || e.doubleValue), r = K(t.integerValue || t.doubleValue);
			return n < r ? -1 : n > r ? 1 : n === r ? 0 : isNaN(n) ? isNaN(r) ? 0 : -1 : 1;
		}(e, t);
		case 3: return Ll(e.timestampValue, t.timestampValue);
		case 4: return Ll(hl(e), hl(t));
		case 5: return kc(e.stringValue, t.stringValue);
		case 6: return function(e, t) {
			let n = cl(e), r = cl(t);
			return n.compareTo(r);
		}(e.bytesValue, t.bytesValue);
		case 7: return function(e, t) {
			let n = e.split("/"), r = t.split("/");
			for (let e = 0; e < n.length && e < r.length; e++) {
				let t = z(n[e], r[e]);
				if (t !== 0) return t;
			}
			return z(n.length, r.length);
		}(e.referenceValue, t.referenceValue);
		case 8: return function(e, t) {
			let n = z(K(e.latitude), K(t.latitude));
			return n === 0 ? z(K(e.longitude), K(t.longitude)) : n;
		}(e.geoPointValue, t.geoPointValue);
		case 9: return Rl(e.arrayValue, t.arrayValue);
		case 10: return function(e, t) {
			let n = e.fields || {}, r = t.fields || {}, i = n[kl]?.arrayValue, a = r[kl]?.arrayValue, o = z(i?.values?.length || 0, a?.values?.length || 0);
			return o === 0 ? Rl(i, a) : o;
		}(e.mapValue, t.mapValue);
		case 11: return function(e, t) {
			if (e === Dl.mapValue && t === Dl.mapValue) return 0;
			if (e === Dl.mapValue) return 1;
			if (t === Dl.mapValue) return -1;
			let n = e.fields || {}, r = Object.keys(n), i = t.fields || {}, a = Object.keys(i);
			r.sort(), a.sort();
			for (let e = 0; e < r.length && e < a.length; ++e) {
				let t = kc(r[e], a[e]);
				if (t !== 0) return t;
				let o = Il(n[r[e]], i[a[e]]);
				if (o !== 0) return o;
			}
			return z(r.length, a.length);
		}(e.mapValue, t.mapValue);
		default: throw I(23264, { l: n });
	}
}
function Ll(e, t) {
	if (typeof e == "string" && typeof t == "string" && e.length === t.length) return z(e, t);
	let n = sl(e), r = sl(t), i = z(n.seconds, r.seconds);
	return i === 0 ? z(n.nanos, r.nanos) : i;
}
function Rl(e, t) {
	let n = e.values || [], r = t.values || [];
	for (let e = 0; e < n.length && e < r.length; ++e) {
		let t = Il(n[e], r[e]);
		if (t !== void 0 && t !== 0) return t;
	}
	return z(n.length, r.length);
}
function zl(e) {
	return Bl(e);
}
function Bl(e) {
	return "nullValue" in e ? "null" : "booleanValue" in e ? "" + e.booleanValue : "integerValue" in e ? "" + e.integerValue : "doubleValue" in e ? "" + e.doubleValue : "timestampValue" in e ? function(e) {
		let t = sl(e);
		return `time(${t.seconds},${t.nanos})`;
	}(e.timestampValue) : "stringValue" in e ? e.stringValue : "bytesValue" in e ? function(e) {
		return cl(e).toBase64();
	}(e.bytesValue) : "referenceValue" in e ? function(e) {
		return U.fromName(e).toString();
	}(e.referenceValue) : "geoPointValue" in e ? function(e) {
		return `geo(${e.latitude},${e.longitude})`;
	}(e.geoPointValue) : "arrayValue" in e ? function(e) {
		let t = "[", n = !0;
		for (let r of e.values || []) n ? n = !1 : t += ",", t += Bl(r);
		return t + "]";
	}(e.arrayValue) : "mapValue" in e ? function(e) {
		let t = Object.keys(e.fields || {}).sort(), n = "{", r = !0;
		for (let i of t) r ? r = !1 : n += ",", n += `${i}:${Bl(e.fields[i])}`;
		return n + "}";
	}(e.mapValue) : I(61005, { value: e });
}
function Vl(e) {
	switch (Nl(e)) {
		case 0:
		case 1: return 4;
		case 2: return 8;
		case 3:
		case 8: return 16;
		case 4:
			let t = ml(e);
			return t ? 16 + Vl(t) : 16;
		case 5: return 2 * e.stringValue.length;
		case 6: return cl(e.bytesValue).approximateByteSize();
		case 7: return e.referenceValue.length;
		case 9: return function(e) {
			return (e.values || []).reduce(((e, t) => e + Vl(t)), 0);
		}(e.arrayValue);
		case 10:
		case 11: return function(e) {
			let t = 0;
			return Gc(e.fields, ((e, n) => {
				t += e.length + Vl(n);
			})), t;
		}(e.mapValue);
		default: throw I(13486, { value: e });
	}
}
function Hl(e) {
	return !!e && "integerValue" in e;
}
function Ul(e) {
	return !!e && "doubleValue" in e;
}
function Wl(e) {
	return Hl(e) || Ul(e);
}
function Gl(e) {
	return !!e && "arrayValue" in e;
}
function Kl(e) {
	return !!e && "nullValue" in e;
}
function ql(e) {
	return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
}
function Jl(e) {
	return !!e && "mapValue" in e;
}
function Yl(e) {
	return (e?.mapValue?.fields || {})[Tl]?.stringValue === Ol;
}
function Xl(e) {
	return (e?.mapValue?.fields || {})[kl]?.arrayValue;
}
function Zl(e) {
	if (e.geoPointValue) return { geoPointValue: { ...e.geoPointValue } };
	if (e.timestampValue && typeof e.timestampValue == "object") return { timestampValue: { ...e.timestampValue } };
	if (e.mapValue) {
		let t = { mapValue: { fields: {} } };
		return Gc(e.mapValue.fields, ((e, n) => t.mapValue.fields[e] = Zl(n))), t;
	}
	if (e.arrayValue) {
		let t = { arrayValue: { values: [] } };
		for (let n = 0; n < (e.arrayValue.values || []).length; ++n) t.arrayValue.values[n] = Zl(e.arrayValue.values[n]);
		return t;
	}
	return { ...e };
}
function Ql(e) {
	return (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue === El;
}
var $l = class e {
	constructor(e) {
		this.value = e;
	}
	static empty() {
		return new e({ mapValue: {} });
	}
	field(e) {
		if (e.isEmpty()) return this.value;
		{
			let t = this.value;
			for (let n = 0; n < e.length - 1; ++n) if (t = (t.mapValue.fields || {})[e.get(n)], !Jl(t)) return null;
			return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
		}
	}
	set(e, t) {
		this.getFieldsMap(e.popLast())[e.lastSegment()] = Zl(t);
	}
	setAll(e) {
		let t = Hc.emptyPath(), n = {}, r = [];
		e.forEach(((e, i) => {
			if (!t.isImmediateParentOf(i)) {
				let e = this.getFieldsMap(t);
				this.applyChanges(e, n, r), n = {}, r = [], t = i.popLast();
			}
			e ? n[i.lastSegment()] = Zl(e) : r.push(i.lastSegment());
		}));
		let i = this.getFieldsMap(t);
		this.applyChanges(i, n, r);
	}
	delete(e) {
		let t = this.field(e.popLast());
		Jl(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
	}
	isEqual(e) {
		return Pl(this.value, e.value);
	}
	getFieldsMap(e) {
		let t = this.value;
		t.mapValue.fields || (t.mapValue = { fields: {} });
		for (let n = 0; n < e.length; ++n) {
			let r = t.mapValue.fields[e.get(n)];
			Jl(r) && r.mapValue.fields || (r = { mapValue: { fields: {} } }, t.mapValue.fields[e.get(n)] = r), t = r;
		}
		return t.mapValue.fields;
	}
	applyChanges(e, t, n) {
		Gc(t, ((t, n) => e[t] = n));
		for (let t of n) delete e[t];
	}
	clone() {
		return new e(Zl(this.value));
	}
};
function eu(e) {
	let t = [];
	return Gc(e.fields, ((e, n) => {
		let r = new Hc([e]);
		if (Jl(n)) {
			let e = eu(n.mapValue).fields;
			if (e.length === 0) t.push(r);
			else for (let n of e) t.push(r.child(n));
		} else t.push(r);
	})), new Uc(t);
}
function tu(e, t) {
	if (e.useProto3Json) {
		if (isNaN(t)) return { doubleValue: "NaN" };
		if (t === 1 / 0) return { doubleValue: "Infinity" };
		if (t === -1 / 0) return { doubleValue: "-Infinity" };
	}
	return { doubleValue: Sl(t) ? "-0" : t };
}
function nu(e) {
	return { integerValue: "" + e };
}
function ru(e, t, n) {
	return Cl(t) ? nu(t) : tu(e, t);
}
var iu = class {
	constructor() {
		this._ = void 0;
	}
};
function au(e, t, n) {
	return e instanceof cu ? function(e, t) {
		let n = { fields: {
			[ul]: { stringValue: ll },
			[fl]: { timestampValue: {
				seconds: e.seconds,
				nanos: e.nanoseconds
			} }
		} };
		return t && pl(t) && (t = ml(t)), t && (n.fields[dl] = t), { mapValue: n };
	}(n, t) : e instanceof lu ? uu(e, t) : e instanceof du ? fu(e, t) : e instanceof mu ? function(e, t) {
		let n = su(e, t), r = vu(n) + vu(e.h);
		return Hl(n) && Hl(e.h) ? nu(r) : tu(e.serializer, r);
	}(e, t) : e instanceof hu ? function(e, t) {
		return _u(e, t, Math.min);
	}(e, t) : e instanceof gu ? function(e, t) {
		return _u(e, t, Math.max);
	}(e, t) : void 0;
}
function ou(e, t, n) {
	return e instanceof lu ? uu(e, t) : e instanceof du ? fu(e, t) : n;
}
function su(e, t) {
	return e instanceof mu ? Wl(t) ? t : { integerValue: 0 } : null;
}
var cu = class extends iu {}, lu = class extends iu {
	constructor(e) {
		super(), this.elements = e;
	}
};
function uu(e, t) {
	let n = yu(t);
	for (let t of e.elements) n.some(((e) => Pl(e, t))) || n.push(t);
	return { arrayValue: { values: n } };
}
var du = class extends iu {
	constructor(e) {
		super(), this.elements = e;
	}
};
function fu(e, t) {
	let n = yu(t);
	for (let t of e.elements) n = n.filter(((e) => !Pl(e, t)));
	return { arrayValue: { values: n } };
}
var pu = class extends iu {
	constructor(e, t) {
		super(), this.serializer = e, this.h = t;
	}
}, mu = class extends pu {}, hu = class extends pu {}, gu = class extends pu {};
function _u(e, t, n) {
	if (!Wl(t)) return e.h;
	let r = n(vu(t), vu(e.h));
	return Hl(t) && Hl(e.h) ? nu(r) : tu(e.serializer, r);
}
function vu(e) {
	return K(e.integerValue || e.doubleValue);
}
function yu(e) {
	return Gl(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
}
var bu = class {
	constructor(e, t) {
		this.field = e, this.transform = t;
	}
};
function xu(e, t) {
	return e.field.isEqual(t.field) && function(e, t) {
		return e instanceof lu && t instanceof lu || e instanceof du && t instanceof du ? Nc(e.elements, t.elements, Pl) : e instanceof mu && t instanceof mu || e instanceof hu && t instanceof hu || e instanceof gu && t instanceof gu ? Pl(e.h, t.h) : e instanceof cu && t instanceof cu;
	}(e.transform, t.transform);
}
var Su = class {
	constructor(e, t) {
		this.version = e, this.transformResults = t;
	}
}, Cu = class e {
	constructor(e, t) {
		this.updateTime = e, this.exists = t;
	}
	static none() {
		return new e();
	}
	static exists(t) {
		return new e(void 0, t);
	}
	static updateTime(t) {
		return new e(t);
	}
	get isNone() {
		return this.updateTime === void 0 && this.exists === void 0;
	}
	isEqual(e) {
		return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
	}
};
function wu(e, t) {
	return e.updateTime === void 0 ? e.exists === void 0 || e.exists === t.isFoundDocument() : t.isFoundDocument() && t.version.isEqual(e.updateTime);
}
var Tu = class {};
function Eu(e, t) {
	if (!e.hasLocalMutations || t && t.fields.length === 0) return null;
	if (t === null) return e.isNoDocument() ? new Iu(e.key, Cu.none()) : new ju(e.key, e.data, Cu.none());
	{
		let n = e.data, r = $l.empty(), i = new Lc(Hc.comparator);
		for (let e of t.fields) if (!i.has(e)) {
			let t = n.field(e);
			t === null && e.length > 1 && (e = e.popLast(), t = n.field(e)), t === null ? r.delete(e) : r.set(e, t), i = i.add(e);
		}
		return new Mu(e.key, r, new Uc(i.toArray()), Cu.none());
	}
}
function Du(e, t, n) {
	e instanceof ju ? function(e, t, n) {
		let r = e.value.clone(), i = Pu(e.fieldTransforms, t, n.transformResults);
		r.setAll(i), t.convertToFoundDocument(n.version, r).setHasCommittedMutations();
	}(e, t, n) : e instanceof Mu ? function(e, t, n) {
		if (!wu(e.precondition, t)) return void t.convertToUnknownDocument(n.version);
		let r = Pu(e.fieldTransforms, t, n.transformResults), i = t.data;
		i.setAll(Nu(e)), i.setAll(r), t.convertToFoundDocument(n.version, i).setHasCommittedMutations();
	}(e, t, n) : function(e, t, n) {
		t.convertToNoDocument(n.version).setHasCommittedMutations();
	}(0, t, n);
}
function Ou(e, t, n, r) {
	return e instanceof ju ? function(e, t, n, r) {
		if (!wu(e.precondition, t)) return n;
		let i = e.value.clone(), a = Fu(e.fieldTransforms, r, t);
		return i.setAll(a), t.convertToFoundDocument(t.version, i).setHasLocalMutations(), null;
	}(e, t, n, r) : e instanceof Mu ? function(e, t, n, r) {
		if (!wu(e.precondition, t)) return n;
		let i = Fu(e.fieldTransforms, r, t), a = t.data;
		return a.setAll(Nu(e)), a.setAll(i), t.convertToFoundDocument(t.version, a).setHasLocalMutations(), n === null ? null : n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(((e) => e.field)));
	}(e, t, n, r) : function(e, t, n) {
		return wu(e.precondition, t) ? (t.convertToNoDocument(t.version).setHasLocalMutations(), null) : n;
	}(e, t, n);
}
function ku(e, t) {
	let n = null;
	for (let r of e.fieldTransforms) {
		let e = t.data.field(r.field), i = su(r.transform, e || null);
		i != null && (n === null && (n = $l.empty()), n.set(r.field, i));
	}
	return n || null;
}
function Au(e, t) {
	return e.type === t.type && !!e.key.isEqual(t.key) && !!e.precondition.isEqual(t.precondition) && !!function(e, t) {
		return e === void 0 && t === void 0 || !(!e || !t) && Nc(e, t, ((e, t) => xu(e, t)));
	}(e.fieldTransforms, t.fieldTransforms) && (e.type === 0 ? e.value.isEqual(t.value) : e.type !== 1 || e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask));
}
var ju = class extends Tu {
	constructor(e, t, n, r = []) {
		super(), this.key = e, this.value = t, this.precondition = n, this.fieldTransforms = r, this.type = 0;
	}
	getFieldMask() {
		return null;
	}
}, Mu = class extends Tu {
	constructor(e, t, n, r, i = []) {
		super(), this.key = e, this.data = t, this.fieldMask = n, this.precondition = r, this.fieldTransforms = i, this.type = 1;
	}
	getFieldMask() {
		return this.fieldMask;
	}
};
function Nu(e) {
	let t = /* @__PURE__ */ new Map();
	return e.fieldMask.fields.forEach(((n) => {
		if (!n.isEmpty()) {
			let r = e.data.field(n);
			t.set(n, r);
		}
	})), t;
}
function Pu(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	L(e.length === n.length, 32656, {
		T: n.length,
		P: e.length
	});
	for (let i = 0; i < n.length; i++) {
		let a = e[i], o = a.transform, s = t.data.field(a.field);
		r.set(a.field, ou(o, s, n[i]));
	}
	return r;
}
function Fu(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let i of e) {
		let e = i.transform, a = n.data.field(i.field);
		r.set(i.field, au(e, a, t));
	}
	return r;
}
var Iu = class extends Tu {
	constructor(e, t) {
		super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
	}
	getFieldMask() {
		return null;
	}
}, Lu = class extends Tu {
	constructor(e, t) {
		super(), this.key = e, this.precondition = t, this.type = 3, this.fieldTransforms = [];
	}
	getFieldMask() {
		return null;
	}
}, Ru = class {
	constructor(e, t) {
		this.position = e, this.inclusive = t;
	}
};
function zu(e, t, n) {
	let r = 0;
	for (let i = 0; i < e.position.length; i++) {
		let a = t[i], o = e.position[i];
		if (r = a.field.isKeyField() ? U.comparator(U.fromName(o.referenceValue), n.key) : Il(o, n.data.field(a.field)), a.dir === "desc" && (r *= -1), r !== 0) break;
	}
	return r;
}
function Bu(e, t) {
	if (e === null) return t === null;
	if (t === null || e.inclusive !== t.inclusive || e.position.length !== t.position.length) return !1;
	for (let n = 0; n < e.position.length; n++) if (!Pl(e.position[n], t.position[n])) return !1;
	return !0;
}
var Vu = class {}, Hu = class e extends Vu {
	constructor(e, t, n) {
		super(), this.field = e, this.op = t, this.value = n;
	}
	static create(t, n, r) {
		return t.isKeyField() ? n === "in" || n === "not-in" ? this.createKeyFieldInFilter(t, n, r) : new Xu(t, n, r) : n === "array-contains" ? new ed(t, r) : n === "in" ? new td(t, r) : n === "not-in" ? new nd(t, r) : n === "array-contains-any" ? new rd(t, r) : new e(t, n, r);
	}
	static createKeyFieldInFilter(e, t, n) {
		return t === "in" ? new Zu(e, n) : new Qu(e, n);
	}
	matches(e) {
		let t = e.data.field(this.field);
		return this.op === "!=" ? t !== null && t.nullValue === void 0 && this.matchesComparison(Il(t, this.value)) : t !== null && Nl(this.value) === Nl(t) && this.matchesComparison(Il(t, this.value));
	}
	matchesComparison(e) {
		switch (this.op) {
			case "<": return e < 0;
			case "<=": return e <= 0;
			case "==": return e === 0;
			case "!=": return e !== 0;
			case ">": return e > 0;
			case ">=": return e >= 0;
			default: return I(47266, { operator: this.op });
		}
	}
	isInequality() {
		return [
			"<",
			"<=",
			">",
			">=",
			"!=",
			"not-in"
		].indexOf(this.op) >= 0;
	}
	getFlattenedFilters() {
		return [this];
	}
	getFilters() {
		return [this];
	}
}, Uu = class e extends Vu {
	constructor(e, t) {
		super(), this.filters = e, this.op = t, this.I = null;
	}
	static create(t, n) {
		return new e(t, n);
	}
	matches(e) {
		return Wu(this) ? this.filters.find(((t) => !t.matches(e))) === void 0 : this.filters.find(((t) => t.matches(e))) !== void 0;
	}
	getFlattenedFilters() {
		return this.I !== null || (this.I = this.filters.reduce(((e, t) => e.concat(t.getFlattenedFilters())), [])), this.I;
	}
	getFilters() {
		return Object.assign([], this.filters);
	}
};
function Wu(e) {
	return e.op === "and";
}
function Gu(e) {
	return Ku(e) && Wu(e);
}
function Ku(e) {
	for (let t of e.filters) if (t instanceof Uu) return !1;
	return !0;
}
function qu(e) {
	if (e instanceof Hu) return e.field.canonicalString() + e.op.toString() + zl(e.value);
	if (Gu(e)) return e.filters.map(((e) => qu(e))).join(",");
	{
		let t = e.filters.map(((e) => qu(e))).join(",");
		return `${e.op}(${t})`;
	}
}
function Ju(e, t) {
	return e instanceof Hu ? function(e, t) {
		return t instanceof Hu && e.op === t.op && e.field.isEqual(t.field) && Pl(e.value, t.value);
	}(e, t) : e instanceof Uu ? function(e, t) {
		return t instanceof Uu && e.op === t.op && e.filters.length === t.filters.length && e.filters.reduce(((e, n, r) => e && Ju(n, t.filters[r])), !0);
	}(e, t) : void I(19439);
}
function Yu(e) {
	return e instanceof Hu ? function(e) {
		return `${e.field.canonicalString()} ${e.op} ${zl(e.value)}`;
	}(e) : e instanceof Uu ? function(e) {
		return e.op.toString() + " {" + e.getFilters().map(Yu).join(" ,") + "}";
	}(e) : "Filter";
}
var Xu = class extends Hu {
	constructor(e, t, n) {
		super(e, t, n), this.key = U.fromName(n.referenceValue);
	}
	matches(e) {
		let t = U.comparator(e.key, this.key);
		return this.matchesComparison(t);
	}
}, Zu = class extends Hu {
	constructor(e, t) {
		super(e, "in", t), this.keys = $u("in", t);
	}
	matches(e) {
		return this.keys.some(((t) => t.isEqual(e.key)));
	}
}, Qu = class extends Hu {
	constructor(e, t) {
		super(e, "not-in", t), this.keys = $u("not-in", t);
	}
	matches(e) {
		return !this.keys.some(((t) => t.isEqual(e.key)));
	}
};
function $u(e, t) {
	return (t.arrayValue?.values || []).map(((e) => U.fromName(e.referenceValue)));
}
var ed = class extends Hu {
	constructor(e, t) {
		super(e, "array-contains", t);
	}
	matches(e) {
		let t = e.data.field(this.field);
		return Gl(t) && Fl(t.arrayValue, this.value);
	}
}, td = class extends Hu {
	constructor(e, t) {
		super(e, "in", t);
	}
	matches(e) {
		let t = e.data.field(this.field);
		return t !== null && Fl(this.value.arrayValue, t);
	}
}, nd = class extends Hu {
	constructor(e, t) {
		super(e, "not-in", t);
	}
	matches(e) {
		if (Fl(this.value.arrayValue, { nullValue: "NULL_VALUE" })) return !1;
		let t = e.data.field(this.field);
		return t !== null && t.nullValue === void 0 && !Fl(this.value.arrayValue, t);
	}
}, rd = class extends Hu {
	constructor(e, t) {
		super(e, "array-contains-any", t);
	}
	matches(e) {
		let t = e.data.field(this.field);
		return !(!Gl(t) || !t.arrayValue.values) && t.arrayValue.values.some(((e) => Fl(this.value.arrayValue, e)));
	}
}, id = class {
	constructor(e, t = "asc") {
		this.field = e, this.dir = t;
	}
};
function ad(e, t) {
	return e.dir === t.dir && e.field.isEqual(t.field);
}
var q = class e {
	static fromTimestamp(t) {
		return new e(t);
	}
	static min() {
		return new e(new G(0, 0));
	}
	static max() {
		return new e(new G(253402300799, 999999999));
	}
	constructor(e) {
		this.timestamp = e;
	}
	compareTo(e) {
		return this.timestamp._compareTo(e.timestamp);
	}
	isEqual(e) {
		return this.timestamp.isEqual(e.timestamp);
	}
	toMicroseconds() {
		return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
	}
	toString() {
		return "SnapshotVersion(" + this.timestamp.toString() + ")";
	}
	toTimestamp() {
		return this.timestamp;
	}
}, od = class e {
	constructor(e, t, n, r, i, a, o) {
		this.key = e, this.documentType = t, this.version = n, this.readTime = r, this.createTime = i, this.data = a, this.documentState = o;
	}
	static newInvalidDocument(t) {
		return new e(t, 0, q.min(), q.min(), q.min(), $l.empty(), 0);
	}
	static newFoundDocument(t, n, r, i) {
		return new e(t, 1, n, q.min(), r, i, 0);
	}
	static newNoDocument(t, n) {
		return new e(t, 2, n, q.min(), q.min(), $l.empty(), 0);
	}
	static newUnknownDocument(t, n) {
		return new e(t, 3, n, q.min(), q.min(), $l.empty(), 2);
	}
	convertToFoundDocument(e, t) {
		return !this.createTime.isEqual(q.min()) || this.documentType !== 2 && this.documentType !== 0 || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
	}
	convertToNoDocument(e) {
		return this.version = e, this.documentType = 2, this.data = $l.empty(), this.documentState = 0, this;
	}
	convertToUnknownDocument(e) {
		return this.version = e, this.documentType = 3, this.data = $l.empty(), this.documentState = 2, this;
	}
	setHasCommittedMutations() {
		return this.documentState = 2, this;
	}
	setHasLocalMutations() {
		return this.documentState = 1, this.version = q.min(), this;
	}
	setReadTime(e) {
		return this.readTime = e, this;
	}
	get hasLocalMutations() {
		return this.documentState === 1;
	}
	get hasCommittedMutations() {
		return this.documentState === 2;
	}
	get hasPendingWrites() {
		return this.hasLocalMutations || this.hasCommittedMutations;
	}
	isValidDocument() {
		return this.documentType !== 0;
	}
	isFoundDocument() {
		return this.documentType === 1;
	}
	isNoDocument() {
		return this.documentType === 2;
	}
	isUnknownDocument() {
		return this.documentType === 3;
	}
	isEqual(t) {
		return t instanceof e && this.key.isEqual(t.key) && this.version.isEqual(t.version) && this.documentType === t.documentType && this.documentState === t.documentState && this.data.isEqual(t.data);
	}
	mutableCopy() {
		return new e(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
	}
	toString() {
		return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
	}
}, sd = -1;
function cd(e, t) {
	let n = e.toTimestamp().seconds, r = e.toTimestamp().nanoseconds + 1;
	return new ud(q.fromTimestamp(r === 1e9 ? new G(n + 1, 0) : new G(n, r)), U.empty(), t);
}
function ld(e) {
	return new ud(e.readTime, e.key, sd);
}
var ud = class e {
	constructor(e, t, n) {
		this.readTime = e, this.documentKey = t, this.largestBatchId = n;
	}
	static min() {
		return new e(q.min(), U.empty(), sd);
	}
	static max() {
		return new e(q.max(), U.empty(), sd);
	}
};
function dd(e, t) {
	let n = e.readTime.compareTo(t.readTime);
	return n === 0 ? (n = U.comparator(e.documentKey, t.documentKey), n === 0 ? z(e.largestBatchId, t.largestBatchId) : n) : n;
}
var fd = class {
	constructor(e, t = null, n = [], r = [], i = null, a = null, o = null) {
		this.path = e, this.collectionGroup = t, this.orderBy = n, this.filters = r, this.limit = i, this.startAt = a, this.endAt = o, this.R = null;
	}
};
function pd(e, t = null, n = [], r = [], i = null, a = null, o = null) {
	return new fd(e, t, n, r, i, a, o);
}
function md(e) {
	let t = R(e);
	if (t.R === null) {
		let e = t.path.canonicalString();
		t.collectionGroup !== null && (e += "|cg:" + t.collectionGroup), e += "|f:", e += t.filters.map(((e) => qu(e))).join(","), e += "|ob:", e += t.orderBy.map(((e) => function(e) {
			return e.field.canonicalString() + e.dir;
		}(e))).join(","), xl(t.limit) || (e += "|l:", e += t.limit), t.startAt && (e += "|lb:", e += t.startAt.inclusive ? "b:" : "a:", e += t.startAt.position.map(((e) => zl(e))).join(",")), t.endAt && (e += "|ub:", e += t.endAt.inclusive ? "a:" : "b:", e += t.endAt.position.map(((e) => zl(e))).join(",")), t.R = e;
	}
	return t.R;
}
function hd(e, t) {
	if (e.limit !== t.limit || e.orderBy.length !== t.orderBy.length) return !1;
	for (let n = 0; n < e.orderBy.length; n++) if (!ad(e.orderBy[n], t.orderBy[n])) return !1;
	if (e.filters.length !== t.filters.length) return !1;
	for (let n = 0; n < e.filters.length; n++) if (!Ju(e.filters[n], t.filters[n])) return !1;
	return e.collectionGroup === t.collectionGroup && !!e.path.isEqual(t.path) && !!Bu(e.startAt, t.startAt) && Bu(e.endAt, t.endAt);
}
function gd(e) {
	return !!e.isCorePipeline;
}
var _d = class {
	constructor(e, t = null, n = [], r = [], i = null, a = "F", o = null, s = null) {
		this.path = e, this.collectionGroup = t, this.explicitOrderBy = n, this.filters = r, this.limit = i, this.limitType = a, this.startAt = o, this.endAt = s, this.A = null, this.V = null, this.m = null, this.startAt, this.endAt;
	}
};
function vd(e, t, n, r, i, a, o, s) {
	return new _d(e, t, n, r, i, a, o, s);
}
function yd(e) {
	return new _d(e);
}
function bd(e) {
	return e.filters.length === 0 && e.limit === null && e.startAt == null && e.endAt == null && (e.explicitOrderBy.length === 0 || e.explicitOrderBy.length === 1 && e.explicitOrderBy[0].field.isKeyField());
}
function xd(e) {
	return U.isDocumentKey(e.path) && e.collectionGroup === null && e.filters.length === 0;
}
function Sd(e) {
	return e.collectionGroup !== null;
}
function Cd(e) {
	let t = R(e);
	if (t.A === null) {
		t.A = [];
		let e = /* @__PURE__ */ new Set();
		for (let n of t.explicitOrderBy) t.A.push(n), e.add(n.field.canonicalString());
		let n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc";
		(function(e) {
			let t = new Lc(Hc.comparator);
			return e.filters.forEach(((e) => {
				e.getFlattenedFilters().forEach(((e) => {
					e.isInequality() && (t = t.add(e.field));
				}));
			})), t;
		})(t).forEach(((r) => {
			e.has(r.canonicalString()) || r.isKeyField() || t.A.push(new id(r, n));
		})), e.has(Hc.keyField().canonicalString()) || t.A.push(new id(Hc.keyField(), n));
	}
	return t.A;
}
function wd(e) {
	let t = R(e);
	return t.V ||= Td(t, Cd(e)), t.V;
}
function Td(e, t) {
	if (e.limitType === "F") return pd(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
	{
		t = t.map(((e) => {
			let t = e.dir === "desc" ? "asc" : "desc";
			return new id(e.field, t);
		}));
		let n = e.endAt ? new Ru(e.endAt.position, e.endAt.inclusive) : null, r = e.startAt ? new Ru(e.startAt.position, e.startAt.inclusive) : null;
		return pd(e.path, e.collectionGroup, t, e.filters, e.limit, n, r);
	}
}
function Ed(e, t, n) {
	return new _d(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, n, e.startAt, e.endAt);
}
function Dd(e, t) {
	return hd(wd(e), wd(t)) && e.limitType === t.limitType;
}
function Od(e) {
	return `Query(target=${function(e) {
		let t = e.path.canonicalString();
		return e.collectionGroup !== null && (t += " collectionGroup=" + e.collectionGroup), e.filters.length > 0 && (t += `, filters: [${e.filters.map(((e) => Yu(e))).join(", ")}]`), xl(e.limit) || (t += ", limit: " + e.limit), e.orderBy.length > 0 && (t += `, orderBy: [${e.orderBy.map(((e) => function(e) {
			return `${e.field.canonicalString()} (${e.dir})`;
		}(e))).join(", ")}]`), e.startAt && (t += ", startAt: ", t += e.startAt.inclusive ? "b:" : "a:", t += e.startAt.position.map(((e) => zl(e))).join(",")), e.endAt && (t += ", endAt: ", t += e.endAt.inclusive ? "a:" : "b:", t += e.endAt.position.map(((e) => zl(e))).join(",")), `Target(${t})`;
	}(wd(e))}; limitType=${e.limitType})`;
}
function kd(e, t) {
	return t.isFoundDocument() && function(e, t) {
		let n = t.key.path;
		return e.collectionGroup === null ? U.isDocumentKey(e.path) ? e.path.isEqual(n) : e.path.isImmediateParentOf(n) : t.key.hasCollectionId(e.collectionGroup) && e.path.isPrefixOf(n);
	}(e, t) && function(e, t) {
		for (let n of Cd(e)) if (!n.field.isKeyField() && t.data.field(n.field) === null) return !1;
		return !0;
	}(e, t) && function(e, t) {
		for (let n of e.filters) if (!n.matches(t)) return !1;
		return !0;
	}(e, t) && function(e, t) {
		return !(e.startAt && !function(e, t, n) {
			let r = zu(e, t, n);
			return e.inclusive ? r <= 0 : r < 0;
		}(e.startAt, Cd(e), t) || e.endAt && !function(e, t, n) {
			let r = zu(e, t, n);
			return e.inclusive ? r >= 0 : r > 0;
		}(e.endAt, Cd(e), t));
	}(e, t);
}
function Ad(e) {
	return (t, n) => {
		let r = !1;
		for (let i of Cd(e)) {
			let e = jd(i, t, n);
			if (e !== 0) return e;
			r ||= i.field.isKeyField();
		}
		return 0;
	};
}
function jd(e, t, n) {
	let r = e.field.isKeyField() ? U.comparator(t.key, n.key) : function(e, t, n) {
		let r = t.data.field(e), i = n.data.field(e);
		return r !== null && i !== null ? Il(r, i) : I(42886);
	}(e.field, t, n);
	switch (e.dir) {
		case "asc": return r;
		case "desc": return -1 * r;
		default: return I(19790, { direction: e.dir });
	}
}
var Md, J;
function Nd(e) {
	switch (e) {
		case B.OK: return I(64938);
		case B.CANCELLED:
		case B.UNKNOWN:
		case B.DEADLINE_EXCEEDED:
		case B.RESOURCE_EXHAUSTED:
		case B.INTERNAL:
		case B.UNAVAILABLE:
		case B.UNAUTHENTICATED: return !1;
		case B.INVALID_ARGUMENT:
		case B.NOT_FOUND:
		case B.ALREADY_EXISTS:
		case B.PERMISSION_DENIED:
		case B.FAILED_PRECONDITION:
		case B.ABORTED:
		case B.OUT_OF_RANGE:
		case B.UNIMPLEMENTED:
		case B.DATA_LOSS: return !0;
		default: return I(15467, { code: e });
	}
}
function Pd(e) {
	if (e === void 0) return Cc("GRPC error has no .code"), B.UNKNOWN;
	switch (e) {
		case Md.OK: return B.OK;
		case Md.CANCELLED: return B.CANCELLED;
		case Md.UNKNOWN: return B.UNKNOWN;
		case Md.DEADLINE_EXCEEDED: return B.DEADLINE_EXCEEDED;
		case Md.RESOURCE_EXHAUSTED: return B.RESOURCE_EXHAUSTED;
		case Md.INTERNAL: return B.INTERNAL;
		case Md.UNAVAILABLE: return B.UNAVAILABLE;
		case Md.UNAUTHENTICATED: return B.UNAUTHENTICATED;
		case Md.INVALID_ARGUMENT: return B.INVALID_ARGUMENT;
		case Md.NOT_FOUND: return B.NOT_FOUND;
		case Md.ALREADY_EXISTS: return B.ALREADY_EXISTS;
		case Md.PERMISSION_DENIED: return B.PERMISSION_DENIED;
		case Md.FAILED_PRECONDITION: return B.FAILED_PRECONDITION;
		case Md.ABORTED: return B.ABORTED;
		case Md.OUT_OF_RANGE: return B.OUT_OF_RANGE;
		case Md.UNIMPLEMENTED: return B.UNIMPLEMENTED;
		case Md.DATA_LOSS: return B.DATA_LOSS;
		default: return I(39323, { code: e });
	}
}
(J = Md ||= {})[J.OK = 0] = "OK", J[J.CANCELLED = 1] = "CANCELLED", J[J.UNKNOWN = 2] = "UNKNOWN", J[J.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", J[J.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", J[J.NOT_FOUND = 5] = "NOT_FOUND", J[J.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", J[J.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", J[J.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", J[J.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", J[J.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", J[J.ABORTED = 10] = "ABORTED", J[J.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", J[J.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", J[J.INTERNAL = 13] = "INTERNAL", J[J.UNAVAILABLE = 14] = "UNAVAILABLE", J[J.DATA_LOSS = 15] = "DATA_LOSS";
var Fd = class {
	constructor(e, t) {
		this.mapKeyFn = e, this.equalsFn = t, this.inner = {}, this.innerSize = 0;
	}
	get(e) {
		let t = this.mapKeyFn(e), n = this.inner[t];
		if (n !== void 0) {
			for (let [t, r] of n) if (this.equalsFn(t, e)) return r;
		}
	}
	has(e) {
		return this.get(e) !== void 0;
	}
	set(e, t) {
		let n = this.mapKeyFn(e), r = this.inner[n];
		if (r === void 0) return this.inner[n] = [[e, t]], void this.innerSize++;
		for (let n = 0; n < r.length; n++) if (this.equalsFn(r[n][0], e)) return void (r[n] = [e, t]);
		r.push([e, t]), this.innerSize++;
	}
	delete(e) {
		let t = this.mapKeyFn(e), n = this.inner[t];
		if (n === void 0) return !1;
		for (let r = 0; r < n.length; r++) if (this.equalsFn(n[r][0], e)) return n.length === 1 ? delete this.inner[t] : n.splice(r, 1), this.innerSize--, !0;
		return !1;
	}
	forEach(e) {
		Gc(this.inner, ((t, n) => {
			for (let [t, r] of n) e(t, r);
		}));
	}
	isEmpty() {
		return qc(this.inner);
	}
	size() {
		return this.innerSize;
	}
}, Id = new Pc(U.comparator);
function Ld() {
	return Id;
}
var Rd = new Pc(U.comparator);
function zd(...e) {
	let t = Rd;
	for (let n of e) t = t.insert(n.key, n);
	return t;
}
function Bd(e) {
	let t = Rd;
	return e.forEach(((e, n) => t = t.insert(e, n.overlayedDocument))), t;
}
function Vd() {
	return Ud();
}
function Hd() {
	return Ud();
}
function Ud() {
	return new Fd(((e) => e.toString()), ((e, t) => e.isEqual(t)));
}
var Wd = new Pc(U.comparator), Gd = new Lc(U.comparator);
function Kd(...e) {
	let t = Gd;
	for (let n of e) t = t.add(n);
	return t;
}
var qd = new Lc(z);
function Jd() {
	return qd;
}
new Io([4294967295, 4294967295], 0);
var Yd = class {
	constructor(e, t) {
		this.databaseId = e, this.useProto3Json = t;
	}
};
function Xd(e, t) {
	return e.useProto3Json ? `${(/* @__PURE__ */ new Date(1e3 * t.seconds)).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z` : {
		seconds: "" + t.seconds,
		nanos: t.nanoseconds
	};
}
function Zd(e) {
	let t = sl(e);
	return new G(t.seconds, t.nanos);
}
function Qd(e, t) {
	return e.useProto3Json ? t.toBase64() : t.toUint8Array();
}
function $d(e, t) {
	return Xd(e, t.toTimestamp());
}
function ef(e) {
	return L(!!e, 49232), q.fromTimestamp(Zd(e));
}
function tf(e, t) {
	return nf(e, t).canonicalString();
}
function nf(e, t) {
	let n = function(e) {
		return new H([
			"projects",
			e.projectId,
			"databases",
			e.database
		]);
	}(e).child("documents");
	return t === void 0 ? n : n.child(t);
}
function rf(e) {
	let t = H.fromString(e);
	return L(gf(t), 10190, { key: t.toString() }), t;
}
function af(e, t) {
	return tf(e.databaseId, t.path);
}
function of(e) {
	let t = rf(e);
	return t.length === 4 ? H.emptyPath() : cf(t);
}
function sf(e) {
	return new H([
		"projects",
		e.databaseId.projectId,
		"databases",
		e.databaseId.database
	]).canonicalString();
}
function cf(e) {
	return L(e.length > 4 && e.get(4) === "documents", 29091, { key: e.toString() }), e.popFirst(5);
}
function lf(e, t, n) {
	return {
		name: af(e, t),
		fields: n.value.mapValue.fields
	};
}
function uf(e, t) {
	let n;
	if (t instanceof ju) n = { update: lf(e, t.key, t.value) };
	else if (t instanceof Iu) n = { delete: af(e, t.key) };
	else if (t instanceof Mu) n = {
		update: lf(e, t.key, t.data),
		updateMask: hf(t.fieldMask)
	};
	else {
		if (!(t instanceof Lu)) return I(16599, { be: t.type });
		n = { verify: af(e, t.key) };
	}
	return t.fieldTransforms.length > 0 && (n.updateTransforms = t.fieldTransforms.map(((e) => function(e, t) {
		let n = t.transform;
		if (n instanceof cu) return {
			fieldPath: t.field.canonicalString(),
			setToServerValue: "REQUEST_TIME"
		};
		if (n instanceof lu) return {
			fieldPath: t.field.canonicalString(),
			appendMissingElements: { values: n.elements }
		};
		if (n instanceof du) return {
			fieldPath: t.field.canonicalString(),
			removeAllFromArray: { values: n.elements }
		};
		if (n instanceof mu) return {
			fieldPath: t.field.canonicalString(),
			increment: n.h
		};
		if (n instanceof hu) return {
			fieldPath: t.field.canonicalString(),
			minimum: n.h
		};
		if (n instanceof gu) return {
			fieldPath: t.field.canonicalString(),
			maximum: n.h
		};
		throw I(20930, { transform: t.transform });
	}(0, e)))), t.precondition.isNone || (n.currentDocument = function(e, t) {
		return t.updateTime === void 0 ? t.exists === void 0 ? I(27497) : { exists: t.exists } : { updateTime: $d(e, t.updateTime) };
	}(e, t.precondition)), n;
}
function df(e, t) {
	return e && e.length > 0 ? (L(t !== void 0, 14353), e.map(((e) => function(e, t) {
		let n = e.updateTime ? ef(e.updateTime) : ef(t);
		return n.isEqual(q.min()) && (n = ef(t)), new Su(n, e.transformResults || []);
	}(e, t)))) : [];
}
function ff(e) {
	let t = of(e.parent), n = e.structuredQuery, r = n.from ? n.from.length : 0, i = null;
	if (r > 0) {
		L(r === 1, 65062);
		let e = n.from[0];
		e.allDescendants ? i = e.collectionId : t = t.child(e.collectionId);
	}
	let a = [];
	n.where && (a = function(e) {
		let t = pf(e);
		return t instanceof Uu && Gu(t) ? t.getFilters() : [t];
	}(n.where));
	let o = [];
	n.orderBy && (o = function(e) {
		return e.map(((e) => function(e) {
			return new id(mf(e.field), function(e) {
				switch (e) {
					case "ASCENDING": return "asc";
					case "DESCENDING": return "desc";
					default: return;
				}
			}(e.direction));
		}(e)));
	}(n.orderBy));
	let s = null;
	n.limit && (s = function(e) {
		let t;
		return t = typeof e == "object" ? e.value : e, xl(t) ? null : t;
	}(n.limit));
	let c = null;
	n.startAt && (c = function(e) {
		let t = !!e.before;
		return new Ru(e.values || [], t);
	}(n.startAt));
	let l = null;
	return n.endAt && (l = function(e) {
		let t = !e.before;
		return new Ru(e.values || [], t);
	}(n.endAt)), vd(t, i, o, a, s, "F", c, l);
}
function pf(e) {
	return e.unaryFilter === void 0 ? e.fieldFilter === void 0 ? e.compositeFilter === void 0 ? I(30097, { filter: e }) : function(e) {
		return Uu.create(e.compositeFilter.filters.map(((e) => pf(e))), function(e) {
			switch (e) {
				case "AND": return "and";
				case "OR": return "or";
				default: return I(1026);
			}
		}(e.compositeFilter.op));
	}(e) : function(e) {
		return Hu.create(mf(e.fieldFilter.field), function(e) {
			switch (e) {
				case "EQUAL": return "==";
				case "NOT_EQUAL": return "!=";
				case "GREATER_THAN": return ">";
				case "GREATER_THAN_OR_EQUAL": return ">=";
				case "LESS_THAN": return "<";
				case "LESS_THAN_OR_EQUAL": return "<=";
				case "ARRAY_CONTAINS": return "array-contains";
				case "IN": return "in";
				case "NOT_IN": return "not-in";
				case "ARRAY_CONTAINS_ANY": return "array-contains-any";
				case "OPERATOR_UNSPECIFIED": return I(58110);
				default: return I(50506);
			}
		}(e.fieldFilter.op), e.fieldFilter.value);
	}(e) : function(e) {
		switch (e.unaryFilter.op) {
			case "IS_NAN":
				let t = mf(e.unaryFilter.field);
				return Hu.create(t, "==", { doubleValue: NaN });
			case "IS_NULL":
				let n = mf(e.unaryFilter.field);
				return Hu.create(n, "==", { nullValue: "NULL_VALUE" });
			case "IS_NOT_NAN":
				let r = mf(e.unaryFilter.field);
				return Hu.create(r, "!=", { doubleValue: NaN });
			case "IS_NOT_NULL":
				let i = mf(e.unaryFilter.field);
				return Hu.create(i, "!=", { nullValue: "NULL_VALUE" });
			case "OPERATOR_UNSPECIFIED": return I(61313);
			default: return I(60726);
		}
	}(e);
}
function mf(e) {
	return Hc.fromServerFormat(e.fieldPath);
}
function hf(e) {
	let t = [];
	return e.fields.forEach(((e) => t.push(e.canonicalString()))), { fieldPaths: t };
}
function gf(e) {
	return e.length >= 4 && e.get(0) === "projects" && e.get(2) === "databases";
}
function _f(e) {
	return !!e && typeof e._toProto == "function" && e._protoValueType === "ProtoValue";
}
function vf(e, t) {
	let n = { fields: {} };
	return t.forEach(((t, r) => {
		if (typeof r != "string") throw Error(`Cannot encode map with non-string key: ${r}`);
		n.fields[r] = t._toProto(e);
	})), { mapValue: n };
}
function yf(e) {
	return { stringValue: e };
}
function bf(e) {
	return new Yd(e, !0);
}
var xf = class e {
	constructor(e) {
		this._byteString = e;
	}
	static fromBase64String(t) {
		try {
			return new e(al.fromBase64String(t));
		} catch (e) {
			throw new V(B.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e);
		}
	}
	static fromUint8Array(t) {
		return new e(al.fromUint8Array(t));
	}
	toBase64() {
		return this._byteString.toBase64();
	}
	toUint8Array() {
		return this._byteString.toUint8Array();
	}
	toString() {
		return "Bytes(base64: " + this.toBase64() + ")";
	}
	isEqual(e) {
		return this._byteString.isEqual(e._byteString);
	}
	toJSON() {
		return {
			type: e._jsonSchemaVersion,
			bytes: this.toBase64()
		};
	}
	static fromJSON(t) {
		if (tl(t, e._jsonSchema)) return e.fromBase64String(t.bytes);
	}
};
xf._jsonSchemaVersion = "firestore/bytes/1.0", xf._jsonSchema = {
	type: W("string", xf._jsonSchemaVersion),
	bytes: W("string")
};
var Sf = class {
	constructor(...e) {
		for (let t = 0; t < e.length; ++t) if (e[t].length === 0) throw new V(B.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
		this._internalPath = new Hc(e);
	}
	isEqual(e) {
		return this._internalPath.isEqual(e._internalPath);
	}
};
function Cf() {
	return new Sf(zc);
}
var wf = class {
	constructor(e) {
		this._methodName = e;
	}
}, Tf = class e {
	constructor(e, t) {
		if (!isFinite(e) || e < -90 || e > 90) throw new V(B.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
		if (!isFinite(t) || t < -180 || t > 180) throw new V(B.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
		this._lat = e, this._long = t;
	}
	get latitude() {
		return this._lat;
	}
	get longitude() {
		return this._long;
	}
	isEqual(e) {
		return this._lat === e._lat && this._long === e._long;
	}
	_compareTo(e) {
		return z(this._lat, e._lat) || z(this._long, e._long);
	}
	toJSON() {
		return {
			latitude: this._lat,
			longitude: this._long,
			type: e._jsonSchemaVersion
		};
	}
	static fromJSON(t) {
		if (tl(t, e._jsonSchema)) return new e(t.latitude, t.longitude);
	}
};
Tf._jsonSchemaVersion = "firestore/geoPoint/1.0", Tf._jsonSchema = {
	type: W("string", Tf._jsonSchemaVersion),
	latitude: W("number"),
	longitude: W("number")
};
var Ef = class {
	constructor(e) {
		this.uid = e;
	}
	isAuthenticated() {
		return this.uid != null;
	}
	toKey() {
		return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
	}
	isEqual(e) {
		return e.uid === this.uid;
	}
};
Ef.UNAUTHENTICATED = new Ef(null), Ef.GOOGLE_CREDENTIALS = new Ef("google-credentials-uid"), Ef.FIRST_PARTY = new Ef("first-party-uid"), Ef.MOCK_USER = new Ef("mock-user");
var Df = class {
	constructor() {
		this.promise = new Promise(((e, t) => {
			this.resolve = e, this.reject = t;
		}));
	}
}, Of = class {
	constructor(e, t) {
		this.user = t, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${e}`);
	}
}, kf = class {
	getToken() {
		return Promise.resolve(null);
	}
	invalidateToken() {}
	start(e, t) {
		e.enqueueRetryable((() => t(Ef.UNAUTHENTICATED)));
	}
	shutdown() {}
}, Af = class {
	constructor(e) {
		this.token = e, this.changeListener = null;
	}
	getToken() {
		return Promise.resolve(this.token);
	}
	invalidateToken() {}
	start(e, t) {
		this.changeListener = t, e.enqueueRetryable((() => t(this.token.user)));
	}
	shutdown() {
		this.changeListener = null;
	}
}, jf = class {
	constructor(e) {
		this.De = e, this.currentUser = Ef.UNAUTHENTICATED, this.xe = 0, this.forceRefresh = !1, this.auth = null;
	}
	start(e, t) {
		L(this.Ce === void 0, 42304);
		let n = this.xe, r = (e) => this.xe === n ? Promise.resolve() : (n = this.xe, t(e)), i = new Df();
		this.Ce = () => {
			this.xe++, this.currentUser = this.Fe(), i.resolve(), i = new Df(), e.enqueueRetryable((() => r(this.currentUser)));
		};
		let a = () => {
			let t = i;
			e.enqueueRetryable((async () => {
				await t.promise, await r(this.currentUser);
			}));
		}, o = (e) => {
			F("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e, this.Ce && (this.auth.addAuthTokenListener(this.Ce), a());
		};
		this.De.onInit(((e) => o(e))), setTimeout((() => {
			if (!this.auth) {
				let e = this.De.getImmediate({ optional: !0 });
				e ? o(e) : (F("FirebaseAuthCredentialsProvider", "Auth not yet detected"), i.resolve(), i = new Df());
			}
		}), 0), a();
	}
	getToken() {
		let e = this.xe, t = this.forceRefresh;
		return this.forceRefresh = !1, this.auth ? this.auth.getToken(t).then(((t) => this.xe === e ? t ? (L(typeof t.accessToken == "string", 31837, { Oe: t }), new Of(t.accessToken, this.currentUser)) : null : (F("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()))) : Promise.resolve(null);
	}
	invalidateToken() {
		this.forceRefresh = !0;
	}
	shutdown() {
		this.auth && this.Ce && this.auth.removeAuthTokenListener(this.Ce), this.Ce = void 0;
	}
	Fe() {
		let e = this.auth && this.auth.getUid();
		return L(e === null || typeof e == "string", 2055, { Me: e }), new Ef(e);
	}
}, Mf = class {
	constructor(e, t, n) {
		this.Ne = e, this.Le = t, this.Be = n, this.type = "FirstParty", this.user = Ef.FIRST_PARTY, this.Ue = /* @__PURE__ */ new Map();
	}
	ke() {
		return this.Be ? this.Be() : null;
	}
	get headers() {
		this.Ue.set("X-Goog-AuthUser", this.Ne);
		let e = this.ke();
		return e && this.Ue.set("Authorization", e), this.Le && this.Ue.set("X-Goog-Iam-Authorization-Token", this.Le), this.Ue;
	}
}, Nf = class {
	constructor(e, t, n) {
		this.Ne = e, this.Le = t, this.Be = n;
	}
	getToken() {
		return Promise.resolve(new Mf(this.Ne, this.Le, this.Be));
	}
	start(e, t) {
		e.enqueueRetryable((() => t(Ef.FIRST_PARTY)));
	}
	shutdown() {}
	invalidateToken() {}
}, Pf = class {
	constructor(e) {
		this.value = e, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
	}
}, Ff = class {
	constructor(e, t) {
		this.qe = t, this.forceRefresh = !1, this.appCheck = null, this.$e = null, this.Ke = null, Jt(e) && e.settings.appCheckToken && (this.Ke = e.settings.appCheckToken);
	}
	start(e, t) {
		L(this.Ce === void 0, 3512);
		let n = (e) => {
			e.error != null && F("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);
			let n = e.token !== this.$e;
			return this.$e = e.token, F("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), n ? t(e.token) : Promise.resolve();
		};
		this.Ce = (t) => {
			e.enqueueRetryable((() => n(t)));
		};
		let r = (e) => {
			F("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e, this.Ce && this.appCheck.addTokenListener(this.Ce);
		};
		this.qe.onInit(((e) => r(e))), setTimeout((() => {
			if (!this.appCheck) {
				let e = this.qe.getImmediate({ optional: !0 });
				e ? r(e) : F("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
			}
		}), 0);
	}
	getToken() {
		if (this.Ke) return Promise.resolve(new Pf(this.Ke));
		let e = this.forceRefresh;
		return this.forceRefresh = !1, this.appCheck ? this.appCheck.getToken(e).then(((e) => e ? (L(typeof e.token == "string", 44558, { tokenResult: e }), this.$e = e.token, new Pf(e.token)) : null)) : Promise.resolve(null);
	}
	invalidateToken() {
		this.forceRefresh = !0;
	}
	shutdown() {
		this.appCheck && this.Ce && this.appCheck.removeTokenListener(this.Ce), this.Ce = void 0;
	}
};
function If(e) {
	let t = {};
	return e.timeoutSeconds !== void 0 && (t.timeoutSeconds = e.timeoutSeconds), t;
}
var Lf = class {
	Qe(e) {}
	shutdown() {}
}, Rf = "ConnectivityMonitor", zf = class {
	constructor() {
		this.We = () => this.Ge(), this.ze = () => this.je(), this.He = [], this.Je();
	}
	Qe(e) {
		this.He.push(e);
	}
	shutdown() {
		window.removeEventListener("online", this.We), window.removeEventListener("offline", this.ze);
	}
	Je() {
		window.addEventListener("online", this.We), window.addEventListener("offline", this.ze);
	}
	Ge() {
		F(Rf, "Network connectivity changed: AVAILABLE");
		for (let e of this.He) e(0);
	}
	je() {
		F(Rf, "Network connectivity changed: UNAVAILABLE");
		for (let e of this.He) e(1);
	}
	static Ye() {
		return typeof window < "u" && window.addEventListener !== void 0 && window.removeEventListener !== void 0;
	}
}, Bf = null;
function Vf() {
	return Bf === null ? Bf = function() {
		return 268435456 + Math.round(2147483648 * Math.random());
	}() : Bf++, "0x" + Bf.toString(16);
}
var Hf = "RestConnection", Uf = {
	BatchGetDocuments: "batchGet",
	Commit: "commit",
	RunQuery: "runQuery",
	RunAggregationQuery: "runAggregationQuery",
	ExecutePipeline: "executePipeline"
}, Wf = class {
	get Ze() {
		return !1;
	}
	constructor(e) {
		this.databaseInfo = e, this.databaseId = e.databaseId;
		let t = e.ssl ? "https" : "http", n = encodeURIComponent(this.databaseId.projectId), r = encodeURIComponent(this.databaseId.database);
		this.Xe = t + "://" + e.host, this.et = `projects/${n}/databases/${r}`, this.tt = this.databaseId.database === _l ? `project_id=${n}` : `project_id=${n}&database_id=${r}`;
	}
	nt(e, t, n, r, i) {
		let a = Vf(), o = this.rt(e, t.toUriEncodedString());
		F(Hf, `Sending RPC '${e}' ${a}:`, o, n);
		let s = {
			"google-cloud-resource-prefix": this.et,
			"x-goog-request-params": this.tt
		};
		this.it(s, r, i);
		let { host: c } = new URL(o), l = Te(c);
		return this.st(e, o, s, n, l).then(((t) => (F(Hf, `Received RPC '${e}' ${a}: `, t), t)), ((t) => {
			throw wc(Hf, `RPC '${e}' ${a} failed with error: `, t, "url: ", o, "request:", n), t;
		}));
	}
	_t(e, t, n, r, i, a) {
		return this.nt(e, t, n, r, i);
	}
	it(e, t, n) {
		if (e["X-Goog-Api-Client"] = function() {
			return "gl-js/ fire/" + yc;
		}(), e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach(((t, n) => e[n] = t)), n && n.headers.forEach(((t, n) => e[n] = t)), this.databaseInfo._customHeaders) for (let t of Object.keys(this.databaseInfo._customHeaders)) e[t] = this.databaseInfo._customHeaders[t];
	}
	rt(e, t) {
		let n = Uf[e], r = `${this.Xe}/v1/${t}:${n}`;
		return this.databaseInfo.apiKey && (r = `${r}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`), r;
	}
	terminate() {}
}, Gf = class {
	constructor(e) {
		this.ot = e.ot, this.ut = e.ut;
	}
	ct(e) {
		this.lt = e;
	}
	Et(e) {
		this.ht = e;
	}
	Tt(e) {
		this.Pt = e;
	}
	onMessage(e) {
		this.It = e;
	}
	close() {
		this.ut();
	}
	send(e) {
		this.ot(e);
	}
	Rt() {
		this.lt();
	}
	At() {
		this.ht();
	}
	Vt(e) {
		this.Pt(e);
	}
	dt(e) {
		this.It(e);
	}
}, Kf = "WebChannelConnection", qf = (e, t, n) => {
	e.listen(t, ((e) => {
		try {
			n(e);
		} catch (e) {
			setTimeout((() => {
				throw e;
			}), 0);
		}
	}));
}, Jf = class e extends Wf {
	constructor(e) {
		super(e), this.ft = [], this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
	}
	static gt() {
		e.yt ||= (qf(Go(), Wo.STAT_EVENT, ((e) => {
			e.stat === Uo.PROXY ? F(Kf, "STAT_EVENT: detected buffering proxy") : e.stat === Uo.NOPROXY && F(Kf, "STAT_EVENT: detected no buffering proxy");
		})), !0);
	}
	st(e, t, n, r, i) {
		let a = Vf();
		return new Promise(((i, o) => {
			let s = new zo();
			s.setWithCredentials(!0), s.listenOnce(Vo.COMPLETE, (() => {
				try {
					switch (s.getLastErrorCode()) {
						case Ho.NO_ERROR:
							let t = s.getResponseJson();
							F(Kf, `XHR for RPC '${e}' ${a} received:`, JSON.stringify(t)), i(t);
							break;
						case Ho.TIMEOUT:
							F(Kf, `RPC '${e}' ${a} timed out`), o(new V(B.DEADLINE_EXCEEDED, "Request time out"));
							break;
						case Ho.HTTP_ERROR:
							let n = s.getStatus();
							if (F(Kf, `RPC '${e}' ${a} failed with status:`, n, "response text:", s.getResponseText()), n > 0) {
								let e = s.getResponseJson();
								Array.isArray(e) && (e = e[0]);
								let t = e?.error;
								t && t.status && t.message ? o(new V(function(e) {
									let t = e.toLowerCase().replace(/_/g, "-");
									return Object.values(B).indexOf(t) >= 0 ? t : B.UNKNOWN;
								}(t.status), t.message)) : o(new V(B.UNKNOWN, "Server responded with status " + s.getStatus()));
							} else o(new V(B.UNAVAILABLE, "Connection failed."));
							break;
						default: I(9055, {
							wt: e,
							streamId: a,
							bt: s.getLastErrorCode(),
							St: s.getLastError()
						});
					}
				} finally {
					F(Kf, `RPC '${e}' ${a} completed.`);
				}
			}));
			let c = JSON.stringify(r);
			F(Kf, `RPC '${e}' ${a} sending request:`, r), s.send(t, "POST", c, n, 15);
		}));
	}
	vt(t, n, r) {
		let i = Vf(), a = [
			this.Xe,
			"/",
			"google.firestore.v1.Firestore",
			"/",
			t,
			"/channel"
		], o = this.createWebChannelTransport(), s = {
			httpSessionIdParam: "gsessionid",
			initMessageHeaders: {},
			messageUrlParams: { database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}` },
			sendRawJson: !0,
			supportsCrossDomainXhr: !0,
			internalChannelParams: { forwardChannelRequestTimeoutMs: 6e5 },
			forceLongPolling: this.forceLongPolling,
			detectBufferingProxy: this.autoDetectLongPolling
		}, c = this.longPollingOptions.timeoutSeconds;
		c !== void 0 && (s.longPollingTimeout = Math.round(1e3 * c)), this.useFetchStreams && (s.useFetchStreams = !0), this.it(s.initMessageHeaders, n, r), s.encodeInitMessageHeaders = !0;
		let l = a.join("");
		F(Kf, `Creating RPC '${t}' stream ${i}: ${l}`, s);
		let u = o.createWebChannel(l, s);
		this.Dt(u);
		let d = !1, f = !1, p = new Gf({
			ot: (e) => {
				f ? F(Kf, `Not sending because RPC '${t}' stream ${i} is closed:`, e) : (d ||= (F(Kf, `Opening RPC '${t}' stream ${i} transport.`), u.open(), !0), F(Kf, `RPC '${t}' stream ${i} sending:`, e), u.send(e));
			},
			ut: () => u.close()
		});
		return qf(u, Bo.EventType.OPEN, (() => {
			f || (F(Kf, `RPC '${t}' stream ${i} transport opened.`), p.Rt());
		})), qf(u, Bo.EventType.CLOSE, (() => {
			f || (f = !0, F(Kf, `RPC '${t}' stream ${i} transport closed`), p.Vt(), this.xt(u));
		})), qf(u, Bo.EventType.ERROR, ((e) => {
			f || (f = !0, wc(Kf, `RPC '${t}' stream ${i} transport errored. Name:`, e.name, "Message:", e.message), p.Vt(new V(B.UNAVAILABLE, "The operation could not be completed")));
		})), qf(u, Bo.EventType.MESSAGE, ((e) => {
			if (!f) {
				let n = e.data[0];
				L(!!n, 16349);
				let r = n, a = r?.error || r[0]?.error;
				if (a) {
					F(Kf, `RPC '${t}' stream ${i} received error:`, a);
					let e = a.status, n = function(e) {
						let t = Md[e];
						if (t !== void 0) return Pd(t);
					}(e), r = a.message;
					e === "NOT_FOUND" && r.includes("database") && r.includes("does not exist") && r.includes(this.databaseId.database) && wc(`Database '${this.databaseId.database}' not found. Please check your project configuration.`), n === void 0 && (n = B.INTERNAL, r = "Unknown error status: " + e + " with message " + a.message), f = !0, p.Vt(new V(n, r)), u.close();
				} else F(Kf, `RPC '${t}' stream ${i} received:`, n), p.dt(n);
			}
		})), e.gt(), setTimeout((() => {
			p.At();
		}), 0), p;
	}
	terminate() {
		this.ft.forEach(((e) => e.close())), this.ft = [];
	}
	Dt(e) {
		this.ft.push(e);
	}
	xt(e) {
		this.ft = this.ft.filter(((t) => t === e));
	}
	it(e, t, n) {
		super.it(e, t, n), this.databaseInfo.apiKey && (e["x-goog-api-key"] = this.databaseInfo.apiKey);
	}
	createWebChannelTransport() {
		return Ko();
	}
};
function Yf(e) {
	return new Jf(e);
}
Jf.yt = !1;
var Xf = class {
	constructor(e, t, n = 1e3, r = 1.5, i = 6e4) {
		this.Ct = e, this.timerId = t, this.Ft = n, this.Ot = r, this.Mt = i, this.Nt = 0, this.Lt = null, this.Bt = Date.now(), this.reset();
	}
	reset() {
		this.Nt = 0;
	}
	Ut() {
		this.Nt = this.Mt;
	}
	kt(e) {
		this.cancel();
		let t = Math.floor(this.Nt + this.qt()), n = Math.max(0, Date.now() - this.Bt), r = Math.max(0, t - n);
		r > 0 && F("ExponentialBackoff", `Backing off for ${r} ms (base delay: ${this.Nt} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), this.Lt = this.Ct.enqueueAfterDelay(this.timerId, r, (() => (this.Bt = Date.now(), e()))), this.Nt *= this.Ot, this.Nt < this.Ft && (this.Nt = this.Ft), this.Nt > this.Mt && (this.Nt = this.Mt);
	}
	$t() {
		this.Lt !== null && (this.Lt.skipDelay(), this.Lt = null);
	}
	cancel() {
		this.Lt !== null && (this.Lt.cancel(), this.Lt = null);
	}
	qt() {
		return (Math.random() - .5) * this.Nt;
	}
}, Zf = "PersistentStream", Qf = class {
	constructor(e, t, n, r, i, a, o, s) {
		this.Ct = e, this.Kt = n, this.Qt = r, this.connection = i, this.authCredentialsProvider = a, this.appCheckCredentialsProvider = o, this.listener = s, this.state = 0, this.Wt = 0, this.Gt = null, this.zt = null, this.stream = null, this.jt = 0, this.Ht = new Xf(e, t);
	}
	Jt() {
		return this.state === 1 || this.state === 5 || this.Yt();
	}
	Yt() {
		return this.state === 2 || this.state === 3;
	}
	start() {
		this.jt = 0, this.state === 4 ? this.Zt() : this.auth();
	}
	async stop() {
		this.Jt() && await this.close(0);
	}
	Xt() {
		this.state = 0, this.Ht.reset();
	}
	en() {
		this.Yt() && this.Gt === null && (this.Gt = this.Ct.enqueueAfterDelay(this.Kt, 6e4, (() => this.tn())));
	}
	nn(e) {
		this.rn(), this.stream.send(e);
	}
	async tn() {
		if (this.Yt()) return this.close(0);
	}
	rn() {
		this.Gt &&= (this.Gt.cancel(), null);
	}
	sn() {
		this.zt &&= (this.zt.cancel(), null);
	}
	async close(e, t) {
		this.rn(), this.sn(), this.Ht.cancel(), this.Wt++, e === 4 ? t && t.code === B.RESOURCE_EXHAUSTED ? (Cc(t.toString()), Cc("Using maximum backoff delay to prevent overloading the backend."), this.Ht.Ut()) : t && t.code === B.UNAUTHENTICATED && this.state !== 3 && (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()) : this.Ht.reset(), this.stream !== null && (this._n(), this.stream.close(), this.stream = null), this.state = e, await this.listener.Tt(t);
	}
	_n() {}
	auth() {
		this.state = 1;
		let e = this.an(this.Wt), t = this.Wt;
		Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then((([e, n]) => {
			this.Wt === t && this.un(e, n);
		}), ((t) => {
			e((() => {
				let e = new V(B.UNKNOWN, "Fetching auth token failed: " + t.message);
				return this.cn(e);
			}));
		}));
	}
	un(e, t) {
		let n = this.an(this.Wt);
		this.stream = this.En(e, t), this.stream.ct((() => {
			n((() => this.listener.ct()));
		})), this.stream.Et((() => {
			n((() => (this.state = 2, this.zt = this.Ct.enqueueAfterDelay(this.Qt, 1e4, (() => (this.Yt() && (this.state = 3), Promise.resolve()))), this.listener.Et())));
		})), this.stream.Tt(((e) => {
			n((() => this.cn(e)));
		})), this.stream.onMessage(((e) => {
			n((() => ++this.jt == 1 ? this.hn(e) : this.onNext(e)));
		}));
	}
	Zt() {
		this.state = 5, this.Ht.kt((async () => {
			this.state = 0, this.start();
		}));
	}
	cn(e) {
		return F(Zf, `close with error: ${e}`), this.stream = null, this.close(4, e);
	}
	an(e) {
		return (t) => {
			this.Ct.enqueueAndForget((() => this.Wt === e ? t() : (F(Zf, "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve())));
		};
	}
}, $f = class extends Qf {
	constructor(e, t, n, r, i, a) {
		super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, n, r, a), this.serializer = i;
	}
	get Rn() {
		return this.jt > 0;
	}
	start() {
		this.lastStreamToken = void 0, super.start();
	}
	_n() {
		this.Rn && this.An([]);
	}
	En(e, t) {
		return this.connection.vt("Write", e, t);
	}
	hn(e) {
		return L(!!e.streamToken, 31322), this.lastStreamToken = e.streamToken, L(!e.writeResults || e.writeResults.length === 0, 55816), this.listener.Vn();
	}
	onNext(e) {
		L(!!e.streamToken, 12678), this.lastStreamToken = e.streamToken, this.Ht.reset();
		let t = df(e.writeResults, e.commitTime), n = ef(e.commitTime);
		return this.listener.dn(n, t);
	}
	fn() {
		let e = {};
		e.database = sf(this.serializer), this.nn(e);
	}
	An(e) {
		let t = {
			streamToken: this.lastStreamToken,
			writes: e.map(((e) => uf(this.serializer, e)))
		};
		this.nn(t);
	}
}, ep = class {}, tp = class extends ep {
	constructor(e, t, n, r) {
		super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = n, this.serializer = r, this.mn = !1;
	}
	pn() {
		if (this.mn) throw new V(B.FAILED_PRECONDITION, "The client has already been terminated.");
	}
	nt(e, t, n, r) {
		return this.pn(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then((([i, a]) => this.connection.nt(e, nf(t, n), r, i, a))).catch(((e) => {
			throw e.name === "FirebaseError" ? (e.code === B.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e) : new V(B.UNKNOWN, e.toString());
		}));
	}
	_t(e, t, n, r, i) {
		return this.pn(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then((([a, o]) => this.connection._t(e, nf(t, n), r, a, o, i))).catch(((e) => {
			throw e.name === "FirebaseError" ? (e.code === B.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e) : new V(B.UNKNOWN, e.toString());
		}));
	}
	terminate() {
		this.mn = !0, this.connection.terminate();
	}
};
function np(e, t, n, r) {
	return new tp(e, t, n, r);
}
var rp = "ComponentProvider", ip = /* @__PURE__ */ new Map();
function ap(e, t, n, r, i) {
	return new gl(e, t, n, i.host, i.ssl, i.experimentalForceLongPolling, i.experimentalAutoDetectLongPolling, If(i.experimentalLongPollingOptions), i.useFetchStreams, i.isUsingEmulator, r, i._customHeaders, i.grpcFlowControlWindow);
}
var op = {
	didRun: !1,
	sequenceNumbersCollected: 0,
	targetsRemoved: 0,
	documentsRemoved: 0
}, sp = 41943040, cp = class e {
	static withCacheSize(t) {
		return new e(t, e.DEFAULT_COLLECTION_PERCENTILE, e.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
	}
	constructor(e, t, n) {
		this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = n;
	}
};
cp.DEFAULT_COLLECTION_PERCENTILE = 10, cp.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, cp.DEFAULT = new cp(sp, cp.DEFAULT_COLLECTION_PERCENTILE, cp.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), cp.DISABLED = new cp(-1, 0, 0);
var lp = class {
	constructor(e, t) {
		this.previousValue = e, t && (t.sequenceNumberHandler = (e) => this.gn(e), this.yn = (e) => t.writeSequenceNumber(e));
	}
	gn(e) {
		return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
	}
	next() {
		let e = ++this.previousValue;
		return this.yn && this.yn(e), e;
	}
};
lp.wn = -1;
var up = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.", dp = class {
	constructor() {
		this.onCommittedListeners = [];
	}
	addOnCommittedListener(e) {
		this.onCommittedListeners.push(e);
	}
	raiseOnCommittedEvent() {
		this.onCommittedListeners.forEach(((e) => e()));
	}
};
async function fp(e) {
	if (e.code !== B.FAILED_PRECONDITION || e.message !== up) throw e;
	F("LocalStore", "Unexpectedly lost primary lease");
}
var Y = class e {
	constructor(e) {
		this.nextCallback = null, this.catchCallback = null, this.result = void 0, this.error = void 0, this.isDone = !1, this.callbackAttached = !1, e(((e) => {
			this.isDone = !0, this.result = e, this.nextCallback && this.nextCallback(e);
		}), ((e) => {
			this.isDone = !0, this.error = e, this.catchCallback && this.catchCallback(e);
		}));
	}
	catch(e) {
		return this.next(void 0, e);
	}
	next(t, n) {
		return this.callbackAttached && I(59440), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(n, this.error) : this.wrapSuccess(t, this.result) : new e(((e, r) => {
			this.nextCallback = (n) => {
				this.wrapSuccess(t, n).next(e, r);
			}, this.catchCallback = (t) => {
				this.wrapFailure(n, t).next(e, r);
			};
		}));
	}
	toPromise() {
		return new Promise(((e, t) => {
			this.next(e, t);
		}));
	}
	wrapUserFunction(t) {
		try {
			let n = t();
			return n instanceof e ? n : e.resolve(n);
		} catch (t) {
			return e.reject(t);
		}
	}
	wrapSuccess(t, n) {
		return t ? this.wrapUserFunction((() => t(n))) : e.resolve(n);
	}
	wrapFailure(t, n) {
		return t ? this.wrapUserFunction((() => t(n))) : e.reject(n);
	}
	static resolve(t) {
		return new e(((e, n) => {
			e(t);
		}));
	}
	static reject(t) {
		return new e(((e, n) => {
			n(t);
		}));
	}
	static waitFor(t) {
		return new e(((e, n) => {
			let r = 0, i = 0, a = !1;
			t.forEach(((t) => {
				++r, t.next((() => {
					++i, a && i === r && e();
				}), ((e) => n(e)));
			})), a = !0, i === r && e();
		}));
	}
	static or(t) {
		let n = e.resolve(!1);
		for (let r of t) n = n.next(((t) => t ? e.resolve(t) : r()));
		return n;
	}
	static forEach(e, t) {
		let n = [];
		return e.forEach(((e, r) => {
			n.push(t.call(this, e, r));
		})), this.waitFor(n);
	}
	static mapArray(t, n) {
		return new e(((e, r) => {
			let i = t.length, a = Array(i), o = 0;
			for (let s = 0; s < i; s++) {
				let c = s;
				n(t[c]).next(((t) => {
					a[c] = t, ++o, o === i && e(a);
				}), ((e) => r(e)));
			}
		}));
	}
	static doWhile(t, n) {
		return new e(((e, r) => {
			let i = () => {
				!0 === t() ? n().next((() => {
					i();
				}), r) : e();
			};
			i();
		}));
	}
};
function pp(e) {
	let t = e.match(/Android ([\d.]+)/i), n = t ? t[1].split(".").slice(0, 2).join(".") : "-1";
	return Number(n);
}
function mp(e) {
	return e.name === "IndexedDbTransactionError";
}
var hp = "LruGarbageCollector", gp = 1048576;
function _p([e, t], [n, r]) {
	let i = z(e, n);
	return i === 0 ? z(t, r) : i;
}
var vp = class {
	constructor(e) {
		this.Yn = e, this.buffer = new Lc(_p), this.Zn = 0;
	}
	Xn() {
		return ++this.Zn;
	}
	er(e) {
		let t = [e, this.Xn()];
		if (this.buffer.size < this.Yn) this.buffer = this.buffer.add(t);
		else {
			let e = this.buffer.last();
			_p(t, e) < 0 && (this.buffer = this.buffer.delete(e).add(t));
		}
	}
	get maxValue() {
		return this.buffer.last()[0];
	}
}, yp = class {
	constructor(e, t, n) {
		this.garbageCollector = e, this.asyncQueue = t, this.localStore = n, this.tr = null;
	}
	start() {
		this.garbageCollector.params.cacheSizeCollectionThreshold !== -1 && this.nr(6e4);
	}
	stop() {
		this.tr &&= (this.tr.cancel(), null);
	}
	get started() {
		return this.tr !== null;
	}
	nr(e) {
		F(hp, `Garbage collection scheduled in ${e}ms`), this.tr = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, (async () => {
			this.tr = null;
			try {
				await this.localStore.collectGarbage(this.garbageCollector);
			} catch (e) {
				mp(e) ? F(hp, "Ignoring IndexedDB error during garbage collection: ", e) : await fp(e);
			}
			await this.nr(3e5);
		}));
	}
}, bp = class {
	constructor(e, t) {
		this.rr = e, this.params = t;
	}
	calculateTargetCount(e, t) {
		return this.rr.ir(e).next(((e) => Math.floor(t / 100 * e)));
	}
	nthSequenceNumber(e, t) {
		if (t === 0) return Y.resolve(lp.wn);
		let n = new vp(t);
		return this.rr.forEachTarget(e, ((e) => n.er(e.sequenceNumber))).next((() => this.rr.sr(e, ((e) => n.er(e))))).next((() => n.maxValue));
	}
	removeTargets(e, t, n) {
		return this.rr.removeTargets(e, t, n);
	}
	removeOrphanedDocuments(e, t) {
		return this.rr.removeOrphanedDocuments(e, t);
	}
	collect(e, t) {
		return this.params.cacheSizeCollectionThreshold === -1 ? (F("LruGarbageCollector", "Garbage collection skipped; disabled"), Y.resolve(op)) : this.getCacheSize(e).next(((n) => n < this.params.cacheSizeCollectionThreshold ? (F("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), op) : this._r(e, t)));
	}
	getCacheSize(e) {
		return this.rr.getCacheSize(e);
	}
	_r(e, t) {
		let n, r, i, a, o, s, c, l = Date.now();
		return this.calculateTargetCount(e, this.params.percentileToCollect).next(((t) => (t > this.params.maximumSequenceNumbersToCollect ? (F("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`), r = this.params.maximumSequenceNumbersToCollect) : r = t, a = Date.now(), this.nthSequenceNumber(e, r)))).next(((r) => (n = r, o = Date.now(), this.removeTargets(e, n, t)))).next(((t) => (i = t, s = Date.now(), this.removeOrphanedDocuments(e, n)))).next(((e) => (c = Date.now(), Sc() <= y.DEBUG && F("LruGarbageCollector", `LRU Garbage Collection\n\tCounted targets in ${a - l}ms\n\tDetermined least recently used ${r} in ` + (o - a) + `ms
\tRemoved ${i} targets in ` + (s - o) + `ms
\tRemoved ${e} documents in ` + (c - s) + `ms
Total Duration: ${c - l}ms`), Y.resolve({
			didRun: !0,
			sequenceNumbersCollected: r,
			targetsRemoved: i,
			documentsRemoved: e
		}))));
	}
};
function xp(e, t) {
	return new bp(e, t);
}
var Sp = "firestore.googleapis.com", Cp = !0, wp = class {
	constructor(e) {
		if (e.host === void 0) {
			if (e.ssl !== void 0) throw new V(B.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
			this.host = Sp, this.ssl = Cp;
		} else this.host = e.host, this.ssl = e.ssl ?? Cp;
		if (this.isUsingEmulator = e.emulatorOptions !== void 0, this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, e._customHeaders && (this._customHeaders = { ...e._customHeaders }), e.cacheSizeBytes === void 0) this.cacheSizeBytes = sp;
		else {
			if (e.cacheSizeBytes !== -1 && e.cacheSizeBytes < gp) throw new V(B.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
			this.cacheSizeBytes = e.cacheSizeBytes;
		}
		if (Yc("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = this.experimentalForceLongPolling ? !1 : e.experimentalAutoDetectLongPolling === void 0 || !!e.experimentalAutoDetectLongPolling, this.experimentalLongPollingOptions = If(e.experimentalLongPollingOptions ?? {}), function(e) {
			if (e.timeoutSeconds !== void 0) {
				if (isNaN(e.timeoutSeconds)) throw new V(B.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);
				if (e.timeoutSeconds < 5) throw new V(B.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);
				if (e.timeoutSeconds > 30) throw new V(B.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`);
			}
		}(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams, e.grpcFlowControlWindow !== void 0) {
			if (typeof e.grpcFlowControlWindow != "number" || e.grpcFlowControlWindow <= 0 || e.grpcFlowControlWindow > 2147483647 || !Number.isInteger(e.grpcFlowControlWindow)) throw new V(B.INVALID_ARGUMENT, "grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");
			this.grpcFlowControlWindow = e.grpcFlowControlWindow;
		}
	}
	isEqual(e) {
		return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function(e, t) {
			return e.timeoutSeconds === t.timeoutSeconds;
		}(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams && this.grpcFlowControlWindow === e.grpcFlowControlWindow && function(e, t) {
			if (e === t) return !0;
			if (!e || !t) return !1;
			let n = Object.keys(e), r = Object.keys(t);
			if (n.length !== r.length) return !1;
			for (let r of n) if (e[r] !== t[r]) return !1;
			return !0;
		}(this._customHeaders, e._customHeaders);
	}
}, Tp = class {
	constructor(e, t, n, r) {
		this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = n, this._app = r, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new wp({}), this._settingsFrozen = !1, this._emulatorOptions = {}, this._terminateTask = "notTerminated";
	}
	get app() {
		if (!this._app) throw new V(B.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
		return this._app;
	}
	get _initialized() {
		return this._settingsFrozen;
	}
	get _terminated() {
		return this._terminateTask !== "notTerminated";
	}
	_setSettings(e) {
		if (this._settingsFrozen) throw new V(B.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
		this._settings = new wp(e), this._emulatorOptions = e.emulatorOptions || {}, e.credentials !== void 0 && (this._authCredentials = function(e) {
			if (!e) return new kf();
			switch (e.type) {
				case "firstParty": return new Nf(e.sessionIndex || "0", e.iamToken || null, e.authTokenFactory || null);
				case "provider": return e.client;
				default: throw new V(B.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
			}
		}(e.credentials));
	}
	_getSettings() {
		return this._settings;
	}
	_getEmulatorOptions() {
		return this._emulatorOptions;
	}
	_freezeSettings() {
		return this._settingsFrozen = !0, this._settings;
	}
	_delete() {
		return this._terminateTask === "notTerminated" && (this._terminateTask = this._terminate()), this._terminateTask;
	}
	async _restart() {
		this._terminateTask === "notTerminated" ? await this._terminate() : this._terminateTask = "notTerminated";
	}
	toJSON() {
		return {
			app: this._app,
			databaseId: this._databaseId,
			settings: this._settings
		};
	}
	_terminate() {
		return function(e) {
			let t = ip.get(e);
			t && (F(rp, "Removing Datastore"), ip.delete(e), t.terminate());
		}(this), Promise.resolve();
	}
};
function Ep(e, t, n, r = {}) {
	e = el(e, Tp);
	let i = Te(t), a = e._getSettings(), o = {
		...a,
		emulatorOptions: e._getEmulatorOptions()
	}, s = `${t}:${n}`;
	i && Ee(`https://${s}`), a.host !== Sp && a.host !== s && wc("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");
	let c = {
		...a,
		host: s,
		ssl: i,
		emulatorOptions: r
	};
	if (!he(c, o) && (e._setSettings(c), r.mockUserToken)) {
		let t, n;
		if (typeof r.mockUserToken == "string") t = r.mockUserToken, n = Ef.MOCK_USER;
		else {
			t = ee(r.mockUserToken, e._app?.options.projectId);
			let i = r.mockUserToken.sub || r.mockUserToken.user_id;
			if (!i) throw new V(B.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
			n = new Ef(i);
		}
		e._authCredentials = new Af(new Of(t, n));
	}
}
var Dp = class e {
	constructor(e, t, n) {
		this.converter = t, this._query = n, this.type = "query", this.firestore = e;
	}
	withConverter(t) {
		return new e(this.firestore, t, this._query);
	}
}, Op = class e {
	constructor(e, t, n) {
		this.converter = t, this._key = n, this.type = "document", this.firestore = e;
	}
	get _path() {
		return this._key.path;
	}
	get id() {
		return this._key.path.lastSegment();
	}
	get path() {
		return this._key.path.canonicalString();
	}
	get parent() {
		return new kp(this.firestore, this.converter, this._key.path.popLast());
	}
	withConverter(t) {
		return new e(this.firestore, t, this._key);
	}
	toJSON() {
		return {
			type: e._jsonSchemaVersion,
			referencePath: this._key.toString()
		};
	}
	static fromJSON(t, n, r) {
		if (tl(n, e._jsonSchema)) return new e(t, r || null, new U(H.fromString(n.referencePath)));
	}
};
Op._jsonSchemaVersion = "firestore/documentReference/1.0", Op._jsonSchema = {
	type: W("string", Op._jsonSchemaVersion),
	referencePath: W("string")
};
var kp = class e extends Dp {
	constructor(e, t, n) {
		super(e, t, yd(n)), this._path = n, this.type = "collection";
	}
	get id() {
		return this._query.path.lastSegment();
	}
	get path() {
		return this._query.path.canonicalString();
	}
	get parent() {
		let e = this._path.popLast();
		return e.isEmpty() ? null : new Op(this.firestore, null, new U(e));
	}
	withConverter(t) {
		return new e(this.firestore, t, this._path);
	}
};
function Ap(e, t, ...n) {
	if (e = we(e), Jc("collection", "path", t), e instanceof Tp) {
		let r = H.fromString(t, ...n);
		return Zc(r), new kp(e, null, r);
	}
	{
		if (!(e instanceof Op || e instanceof kp)) throw new V(B.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
		let r = e._path.child(H.fromString(t, ...n));
		return Zc(r), new kp(e.firestore, null, r);
	}
}
function jp(e, t, ...n) {
	if (e = we(e), arguments.length === 1 && (t = Oc.newId()), Jc("doc", "path", t), e instanceof Tp) {
		let r = H.fromString(t, ...n);
		return Xc(r), new Op(e, null, new U(r));
	}
	{
		if (!(e instanceof Op || e instanceof kp)) throw new V(B.INVALID_ARGUMENT, "Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
		let r = e._path.child(H.fromString(t, ...n));
		return Xc(r), new Op(e.firestore, e instanceof kp ? e.converter : null, new U(r));
	}
}
var Mp = class e {
	constructor(e) {
		this._values = (e || []).map(((e) => e));
	}
	toArray() {
		return this._values.map(((e) => e));
	}
	isEqual(e) {
		return function(e, t) {
			if (e.length !== t.length) return !1;
			for (let n = 0; n < e.length; ++n) if (e[n] !== t[n]) return !1;
			return !0;
		}(this._values, e._values);
	}
	toJSON() {
		return {
			type: e._jsonSchemaVersion,
			vectorValues: this._values
		};
	}
	static fromJSON(t) {
		if (tl(t, e._jsonSchema)) {
			if (Array.isArray(t.vectorValues) && t.vectorValues.every(((e) => typeof e == "number"))) return new e(t.vectorValues);
			throw new V(B.INVALID_ARGUMENT, "Expected 'vectorValues' field to be a number array");
		}
	}
};
Mp._jsonSchemaVersion = "firestore/vectorValue/1.0", Mp._jsonSchema = {
	type: W("string", Mp._jsonSchemaVersion),
	vectorValues: W("object")
};
var Np = /^__.*__$/, Pp = class {
	constructor(e, t, n) {
		this.data = e, this.fieldMask = t, this.fieldTransforms = n;
	}
	toMutation(e, t) {
		return this.fieldMask === null ? new ju(e, this.data, t, this.fieldTransforms) : new Mu(e, this.data, this.fieldMask, t, this.fieldTransforms);
	}
};
function Fp(e) {
	switch (e) {
		case 0:
		case 2:
		case 1: return !0;
		case 3:
		case 4: return !1;
		default: throw I(40011, { dataSource: e });
	}
}
var Ip = class e {
	constructor(e, t, n, r, i, a) {
		this.settings = e, this.databaseId = t, this.serializer = n, this.ignoreUndefinedProperties = r, i === void 0 && this.validatePath(), this.fieldTransforms = i || [], this.fieldMask = a || [];
	}
	get path() {
		return this.settings.path;
	}
	get dataSource() {
		return this.settings.dataSource;
	}
	contextWith(t) {
		return new e({
			...this.settings,
			...t
		}, this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
	}
	childContextForField(e) {
		let t = this.path?.child(e), n = this.contextWith({
			path: t,
			arrayElement: !1
		});
		return n.validatePathSegment(e), n;
	}
	childContextForFieldPath(e) {
		let t = this.path?.child(e), n = this.contextWith({
			path: t,
			arrayElement: !1
		});
		return n.validatePath(), n;
	}
	childContextForArray(e) {
		return this.contextWith({
			path: void 0,
			arrayElement: !0
		});
	}
	createError(e) {
		return Yp(e, this.settings.methodName, this.settings.hasConverter || !1, this.path, this.settings.targetDoc);
	}
	contains(e) {
		return this.fieldMask.find(((t) => e.isPrefixOf(t))) !== void 0 || this.fieldTransforms.find(((t) => e.isPrefixOf(t.field))) !== void 0;
	}
	validatePath() {
		if (this.path) for (let e = 0; e < this.path.length; e++) this.validatePathSegment(this.path.get(e));
	}
	validatePathSegment(e) {
		if (e.length === 0) throw this.createError("Document fields must not be empty");
		if (Fp(this.dataSource) && Np.test(e)) throw this.createError("Document fields cannot begin and end with \"__\"");
	}
}, Lp = class {
	constructor(e, t, n) {
		this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = n || bf(e);
	}
	createContext(e, t, n, r = !1) {
		return new Ip({
			dataSource: e,
			methodName: t,
			targetDoc: n,
			path: Hc.emptyPath(),
			arrayElement: !1,
			hasConverter: r
		}, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
	}
};
function Rp(e) {
	let t = e._freezeSettings(), n = bf(e._databaseId);
	return new Lp(e._databaseId, !!t.ignoreUndefinedProperties, n);
}
function zp(e, t, n, r, i, a = {}) {
	let o = e.createContext(a.merge || a.mergeFields ? 2 : 0, t, n, i);
	Gp("Data must be an object, but it was:", o, r);
	let s = Hp(r, o), c, l;
	if (a.merge) c = new Uc(o.fieldMask), l = o.fieldTransforms;
	else if (a.mergeFields) {
		let e = [];
		for (let r of a.mergeFields) {
			let i = Kp(t, r, n);
			if (!o.contains(i)) throw new V(B.INVALID_ARGUMENT, `Field '${i}' is specified in your field mask but missing from your input data.`);
			Xp(e, i) || e.push(i);
		}
		c = new Uc(e), l = o.fieldTransforms.filter(((e) => c.covers(e.field)));
	} else c = null, l = o.fieldTransforms;
	return new Pp(new $l(s), c, l);
}
var Bp = class e extends wf {
	_toFieldTransform(e) {
		return new bu(e.path, new cu());
	}
	isEqual(t) {
		return t instanceof e;
	}
};
function Vp(e, t, n) {
	if (Wp(e = we(e))) return Gp("Unsupported field value:", t, e), Hp(e, t);
	if (e instanceof wf) return function(e, t) {
		if (!Fp(t.dataSource)) throw t.createError(`${e._methodName}() can only be used with update() and set()`);
		if (!t.path) throw t.createError(`${e._methodName}() is not currently supported inside arrays`);
		let n = e._toFieldTransform(t);
		n && t.fieldTransforms.push(n);
	}(e, t), null;
	if (e === void 0 && t.ignoreUndefinedProperties) return null;
	if (t.path && t.fieldMask.push(t.path), e instanceof Array) {
		if (t.settings.arrayElement && t.dataSource !== 4) throw t.createError("Nested arrays are not supported");
		return function(e, t) {
			let n = [], r = 0;
			for (let i of e) {
				let e = Vp(i, t.childContextForArray(r));
				e ??= { nullValue: "NULL_VALUE" }, n.push(e), r++;
			}
			return { arrayValue: { values: n } };
		}(e, t);
	}
	return function(e, t, n) {
		if ((e = we(e)) === null) return { nullValue: "NULL_VALUE" };
		if (typeof e == "number") return ru(t.serializer, e);
		if (typeof e == "boolean") return { booleanValue: e };
		if (typeof e == "string") return { stringValue: e };
		if (e instanceof Date) {
			let n = G.fromDate(e);
			return { timestampValue: Xd(t.serializer, n) };
		}
		if (e instanceof G) {
			let n = new G(e.seconds, 1e3 * Math.floor(e.nanoseconds / 1e3));
			return { timestampValue: Xd(t.serializer, n) };
		}
		if (Up(e)) {
			let n = G.fromInstant(e), r = new G(n.seconds, 1e3 * Math.floor(n.nanoseconds / 1e3));
			return { timestampValue: Xd(t.serializer, r) };
		}
		if (e instanceof Tf) return { geoPointValue: {
			latitude: e.latitude,
			longitude: e.longitude
		} };
		if (e instanceof xf) return { bytesValue: Qd(t.serializer, e._byteString) };
		if (e instanceof Op) {
			let n = t.databaseId, r = e.firestore._databaseId;
			if (!r.isEqual(n)) throw t.createError(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);
			return { referenceValue: tf(e.firestore._databaseId || t.databaseId, e._key.path) };
		}
		if (e instanceof Mp) return function(e, t) {
			let n = e instanceof Mp ? e.toArray() : e;
			return { mapValue: { fields: {
				[Tl]: { stringValue: Ol },
				[kl]: { arrayValue: { values: n.map(((e) => {
					if (typeof e != "number") throw t.createError("VectorValues must only contain numeric values.");
					return tu(t.serializer, e);
				})) } }
			} } };
		}(e, t);
		if (_f(e)) return e._toProto(t.serializer);
		throw t.createError(`Unsupported field value: ${$c(e)}`);
	}(e, t);
}
function Hp(e, t) {
	let n = {};
	return qc(e) ? t.path && t.path.length > 0 && t.fieldMask.push(t.path) : Gc(e, ((e, r) => {
		let i = Vp(r, t.childContextForField(e));
		i != null && (n[e] = i);
	})), { mapValue: { fields: n } };
}
function Up(e) {
	if (typeof e != "object" || !e) return !1;
	if (typeof Temporal < "u" && typeof Temporal.Instant == "function" && e instanceof Temporal.Instant) return !0;
	let t = e;
	return t[Symbol.toStringTag] === "Temporal.Instant" && typeof t.t == "bigint";
}
function Wp(e) {
	return !(typeof e != "object" || !e || e instanceof Array || e instanceof Date || e instanceof G || e instanceof Tf || e instanceof xf || e instanceof Op || e instanceof wf || e instanceof Mp || Up(e) || _f(e));
}
function Gp(e, t, n) {
	if (!Wp(n) || !Qc(n)) {
		let r = $c(n);
		throw r === "an object" ? t.createError(e + " a custom object") : t.createError(e + " " + r);
	}
}
function Kp(e, t, n) {
	if ((t = we(t)) instanceof Sf) return t._internalPath;
	if (typeof t == "string") return Jp(e, t);
	throw Yp("Field path arguments must be of type string or ", e, !1, void 0, n);
}
var qp = /* @__PURE__ */ RegExp("[~\\*/\\[\\]]");
function Jp(e, t, n) {
	if (t.search(qp) >= 0) throw Yp(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`, e, !1, void 0, n);
	try {
		return new Sf(...t.split("."))._internalPath;
	} catch {
		throw Yp(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, e, !1, void 0, n);
	}
}
function Yp(e, t, n, r, i) {
	let a = r && !r.isEmpty(), o = i !== void 0, s = `Function ${t}() called with invalid data`;
	n && (s += " (via `toFirestore()`)"), s += ". ";
	let c = "";
	return (a || o) && (c += " (found", a && (c += ` in field ${r}`), o && (c += ` in document ${i}`), c += ")"), new V(B.INVALID_ARGUMENT, s + e + c);
}
function Xp(e, t) {
	return e.some(((e) => e.isEqual(t)));
}
function Zp(e) {
	return typeof e._readUserData == "function";
}
var Qp = class e {
	constructor(e) {
		this.optionDefinitions = e;
	}
	_getKnownOptions(t, n) {
		let r = $l.empty();
		for (let i in this.optionDefinitions) if (this.optionDefinitions.hasOwnProperty(i)) {
			let a = this.optionDefinitions[i];
			if (i in t) {
				let o = t[i], s;
				a.nestedOptions && Qc(o) ? s = { mapValue: { fields: new e(a.nestedOptions).getOptionsProto(n, o) } } : o && (s = Vp(o, n) ?? void 0), s && r.set(Hc.fromServerFormat(a.serverName), s);
			}
		}
		return r;
	}
	getOptionsProto(e, t, n) {
		let r = this._getKnownOptions(t, e);
		if (n) {
			let t = new Map(Kc(n, ((t, n) => [Hc.fromServerFormat(n), t === void 0 ? null : Vp(t, e)])));
			r.setAll(t);
		}
		return r.value.mapValue.fields ?? {};
	}
};
function $p(e) {
	return typeof e == "object" && !!e && !!("nullValue" in e && (e.nullValue === null || e.nullValue === "NULL_VALUE") || "booleanValue" in e && (e.booleanValue === null || typeof e.booleanValue == "boolean") || "integerValue" in e && (e.integerValue === null || typeof e.integerValue == "number" || typeof e.integerValue == "string") || "doubleValue" in e && (e.doubleValue === null || typeof e.doubleValue == "number") || "timestampValue" in e && (e.timestampValue === null || function(e) {
		return typeof e == "object" && !!e && "seconds" in e && (e.seconds === null || typeof e.seconds == "number" || typeof e.seconds == "string") && "nanos" in e && (e.nanos === null || typeof e.nanos == "number");
	}(e.timestampValue)) || "stringValue" in e && (e.stringValue === null || typeof e.stringValue == "string") || "bytesValue" in e && (e.bytesValue === null || e.bytesValue instanceof Uint8Array) || "referenceValue" in e && (e.referenceValue === null || typeof e.referenceValue == "string") || "geoPointValue" in e && (e.geoPointValue === null || function(e) {
		return typeof e == "object" && !!e && "latitude" in e && (e.latitude === null || typeof e.latitude == "number") && "longitude" in e && (e.longitude === null || typeof e.longitude == "number");
	}(e.geoPointValue)) || "arrayValue" in e && (e.arrayValue === null || function(e) {
		return typeof e == "object" && !!e && !(!("values" in e) || e.values !== null && !Array.isArray(e.values));
	}(e.arrayValue)) || "mapValue" in e && (e.mapValue === null || function(e) {
		return typeof e == "object" && !!e && !(!("fields" in e) || e.fields !== null && !Qc(e.fields));
	}(e.mapValue)) || "fieldReferenceValue" in e && (e.fieldReferenceValue === null || typeof e.fieldReferenceValue == "string") || "functionValue" in e && (e.functionValue === null || function(e) {
		return typeof e == "object" && !!e && !(!("name" in e) || e.name !== null && typeof e.name != "string" || !("args" in e) || e.args !== null && !Array.isArray(e.args));
	}(e.functionValue)) || "pipelineValue" in e && (e.pipelineValue === null || function(e) {
		return typeof e == "object" && !!e && !(!("stages" in e) || e.stages !== null && !Array.isArray(e.stages));
	}(e.pipelineValue)));
}
function em() {
	return new Bp("serverTimestamp");
}
function tm(e) {
	return new Mp(e);
}
function X(e) {
	let t;
	return e instanceof im ? e : (t = Qc(e) ? ym(e) : e instanceof Array ? bm(e) : mm(e, void 0), t);
}
function nm(e) {
	if (e instanceof im) return e;
	if (e instanceof Mp) return pm(e);
	if (Array.isArray(e)) return pm(tm(e));
	throw Error("Unsupported value: " + typeof e);
}
function rm(e) {
	return wl(e) ? um(e) : X(e);
}
var im = class {
	constructor() {
		this._protoValueType = "ProtoValue";
	}
	add(e) {
		return new Z("add", [this, X(e)], "add");
	}
	asBoolean() {
		if (this instanceof hm) return this;
		if (this instanceof fm) return new _m(this);
		if (this instanceof lm) return new vm(this);
		if (this instanceof Z) return new gm(this);
		throw new V("invalid-argument", `Conversion of type ${typeof this} to BooleanExpression not supported.`);
	}
	subtract(e) {
		return new Z("subtract", [this, X(e)], "subtract");
	}
	multiply(e) {
		return new Z("multiply", [this, X(e)], "multiply");
	}
	divide(e) {
		return new Z("divide", [this, X(e)], "divide");
	}
	mod(e) {
		return new Z("mod", [this, X(e)], "mod");
	}
	equal(e) {
		return new Z("equal", [this, X(e)], "equal").asBoolean();
	}
	notEqual(e) {
		return new Z("not_equal", [this, X(e)], "notEqual").asBoolean();
	}
	lessThan(e) {
		return new Z("less_than", [this, X(e)], "lessThan").asBoolean();
	}
	lessThanOrEqual(e) {
		return new Z("less_than_or_equal", [this, X(e)], "lessThanOrEqual").asBoolean();
	}
	greaterThan(e) {
		return new Z("greater_than", [this, X(e)], "greaterThan").asBoolean();
	}
	greaterThanOrEqual(e) {
		return new Z("greater_than_or_equal", [this, X(e)], "greaterThanOrEqual").asBoolean();
	}
	arrayConcat(e, ...t) {
		let n = [e, ...t].map(((e) => X(e)));
		return new Z("array_concat", [this, ...n], "arrayConcat");
	}
	arrayContains(e) {
		return new Z("array_contains", [this, X(e)], "arrayContains").asBoolean();
	}
	arrayContainsAll(e) {
		let t = Array.isArray(e) ? new cm(e.map(X), "arrayContainsAll") : e;
		return new Z("array_contains_all", [this, t], "arrayContainsAll").asBoolean();
	}
	arrayContainsAny(e) {
		let t = Array.isArray(e) ? new cm(e.map(X), "arrayContainsAny") : e;
		return new Z("array_contains_any", [this, t], "arrayContainsAny").asBoolean();
	}
	arrayReverse() {
		return new Z("array_reverse", [this]);
	}
	arrayLength() {
		return new Z("array_length", [this], "arrayLength");
	}
	equalAny(e) {
		let t = Array.isArray(e) ? new cm(e.map(X), "equalAny") : e;
		return new Z("equal_any", [this, t], "equalAny").asBoolean();
	}
	notEqualAny(e) {
		let t = Array.isArray(e) ? new cm(e.map(X), "notEqualAny") : e;
		return new Z("not_equal_any", [this, t], "notEqualAny").asBoolean();
	}
	exists() {
		return new Z("exists", [this], "exists").asBoolean();
	}
	charLength() {
		return new Z("char_length", [this], "charLength");
	}
	like(e) {
		return new Z("like", [this, X(e)], "like").asBoolean();
	}
	regexContains(e) {
		return new Z("regex_contains", [this, X(e)], "regexContains").asBoolean();
	}
	regexFind(e) {
		return new Z("regex_find", [this, X(e)], "regexFind");
	}
	regexFindAll(e) {
		return new Z("regex_find_all", [this, X(e)], "regexFindAll");
	}
	regexMatch(e) {
		return new Z("regex_match", [this, X(e)], "regexMatch").asBoolean();
	}
	stringContains(e) {
		return new Z("string_contains", [this, X(e)], "stringContains").asBoolean();
	}
	startsWith(e) {
		return new Z("starts_with", [this, X(e)], "startsWith").asBoolean();
	}
	endsWith(e) {
		return new Z("ends_with", [this, X(e)], "endsWith").asBoolean();
	}
	toLower() {
		return new Z("to_lower", [this], "toLower");
	}
	toUpper() {
		return new Z("to_upper", [this], "toUpper");
	}
	trim(e) {
		let t = [this];
		return e && t.push(X(e)), new Z("trim", t, "trim");
	}
	ltrim(e) {
		let t = [this];
		return e && t.push(X(e)), new Z("ltrim", t, "ltrim");
	}
	rtrim(e) {
		let t = [this];
		return e && t.push(X(e)), new Z("rtrim", t, "rtrim");
	}
	type() {
		return new Z("type", [this]);
	}
	isType(e) {
		return new Z("is_type", [this, pm(e)], "isType").asBoolean();
	}
	stringConcat(e, ...t) {
		let n = [e, ...t].map(X);
		return new Z("string_concat", [this, ...n], "stringConcat");
	}
	stringIndexOf(e) {
		return new Z("string_index_of", [this, X(e)], "stringIndexOf");
	}
	stringRepeat(e) {
		return new Z("string_repeat", [this, X(e)], "stringRepeat");
	}
	stringReplaceAll(e, t) {
		return new Z("string_replace_all", [
			this,
			X(e),
			X(t)
		], "stringReplaceAll");
	}
	stringReplaceOne(e, t) {
		return new Z("string_replace_one", [
			this,
			X(e),
			X(t)
		], "stringReplaceOne");
	}
	concat(e, ...t) {
		let n = [e, ...t].map(X);
		return new Z("concat", [this, ...n], "concat");
	}
	reverse() {
		return new Z("reverse", [this], "reverse");
	}
	arrayFilter(e, t) {
		return new Z("array_filter", [
			this,
			X(e),
			t
		], "arrayFilter");
	}
	arrayTransform(e, t) {
		return new Z("array_transform", [
			this,
			X(e),
			t
		], "arrayTransform");
	}
	arrayTransformWithIndex(e, t, n) {
		return new Z("array_transform", [
			this,
			X(e),
			X(t),
			n
		], "arrayTransformWithIndex");
	}
	arraySlice(e, t) {
		let n = [this, X(e)];
		return t !== void 0 && n.push(X(t)), new Z("array_slice", n, "arraySlice");
	}
	arrayFirst() {
		return new Z("array_first", [this], "arrayFirst");
	}
	arrayFirstN(e) {
		return new Z("array_first_n", [this, X(e)], "arrayFirstN");
	}
	arrayLast() {
		return new Z("array_last", [this], "arrayLast");
	}
	arrayLastN(e) {
		return new Z("array_last_n", [this, X(e)], "arrayLastN");
	}
	arrayMaximum() {
		return new Z("maximum", [this], "arrayMaximum");
	}
	arrayMaximumN(e) {
		return new Z("maximum_n", [this, X(e)], "arrayMaximumN");
	}
	arrayMinimum() {
		return new Z("minimum", [this], "arrayMinimum");
	}
	arrayMinimumN(e) {
		return new Z("minimum_n", [this, X(e)], "arrayMinimumN");
	}
	arrayIndexOf(e) {
		return new Z("array_index_of", [
			this,
			X(e),
			X("first")
		], "arrayIndexOf");
	}
	arrayLastIndexOf(e) {
		return new Z("array_index_of", [
			this,
			X(e),
			X("last")
		], "arrayLastIndexOf");
	}
	arrayIndexOfAll(e) {
		return new Z("array_index_of_all", [this, X(e)], "arrayIndexOfAll");
	}
	byteLength() {
		return new Z("byte_length", [this], "byteLength");
	}
	ceil() {
		return new Z("ceil", [this]);
	}
	floor() {
		return new Z("floor", [this]);
	}
	abs() {
		return new Z("abs", [this]);
	}
	exp() {
		return new Z("exp", [this]);
	}
	mapGet(e) {
		return new Z("map_get", [this, pm(e)], "mapGet");
	}
	mapSet(e, t, ...n) {
		return new Z("map_set", [
			this,
			X(e),
			X(t),
			...n.map(X)
		], "mapSet");
	}
	mapKeys() {
		return new Z("map_keys", [this], "mapKeys");
	}
	mapValues() {
		return new Z("map_values", [this], "mapValues");
	}
	mapEntries() {
		return new Z("map_entries", [this], "mapEntries");
	}
	getField(e) {
		return new Z("get_field", [this, X(e)], "get_field");
	}
	count() {
		return am._create("count", [this], "count");
	}
	sum() {
		return am._create("sum", [this], "sum");
	}
	average() {
		return am._create("average", [this], "average");
	}
	minimum() {
		return am._create("minimum", [this], "minimum");
	}
	maximum() {
		return am._create("maximum", [this], "maximum");
	}
	first() {
		return am._create("first", [this], "first");
	}
	last() {
		return am._create("last", [this], "last");
	}
	arrayAgg() {
		return am._create("array_agg", [this], "arrayAgg");
	}
	arrayAggDistinct() {
		return am._create("array_agg_distinct", [this], "arrayAggDistinct");
	}
	countDistinct() {
		return am._create("count_distinct", [this], "countDistinct");
	}
	logicalMaximum(e, ...t) {
		let n = [e, ...t];
		return new Z("maximum", [this, ...n.map(X)], "logicalMaximum");
	}
	logicalMinimum(e, ...t) {
		let n = [e, ...t];
		return new Z("minimum", [this, ...n.map(X)], "minimum");
	}
	vectorLength() {
		return new Z("vector_length", [this], "vectorLength");
	}
	cosineDistance(e) {
		return new Z("cosine_distance", [this, nm(e)], "cosineDistance");
	}
	dotProduct(e) {
		return new Z("dot_product", [this, nm(e)], "dotProduct");
	}
	euclideanDistance(e) {
		return new Z("euclidean_distance", [this, nm(e)], "euclideanDistance");
	}
	unixMicrosToTimestamp() {
		return new Z("unix_micros_to_timestamp", [this], "unixMicrosToTimestamp");
	}
	timestampToUnixMicros() {
		return new Z("timestamp_to_unix_micros", [this], "timestampToUnixMicros");
	}
	unixMillisToTimestamp() {
		return new Z("unix_millis_to_timestamp", [this], "unixMillisToTimestamp");
	}
	timestampToUnixMillis() {
		return new Z("timestamp_to_unix_millis", [this], "timestampToUnixMillis");
	}
	unixSecondsToTimestamp() {
		return new Z("unix_seconds_to_timestamp", [this], "unixSecondsToTimestamp");
	}
	timestampToUnixSeconds() {
		return new Z("timestamp_to_unix_seconds", [this], "timestampToUnixSeconds");
	}
	timestampAdd(e, t) {
		return new Z("timestamp_add", [
			this,
			X(e),
			X(t)
		], "timestampAdd");
	}
	timestampSubtract(e, t) {
		return new Z("timestamp_subtract", [
			this,
			X(e),
			X(t)
		], "timestampSubtract");
	}
	timestampDiff(e, t) {
		return new Z("timestamp_diff", [
			this,
			rm(e),
			X(t)
		], "timestampDiff");
	}
	timestampExtract(e, t) {
		let n = [this, X(e)];
		return t && n.push(X(t)), new Z("timestamp_extract", n, "timestampExtract");
	}
	documentId() {
		return new Z("document_id", [this], "documentId");
	}
	parent() {
		return new Z("parent", [this], "parent");
	}
	substring(e, t) {
		let n = X(e);
		return new Z("substring", t === void 0 ? [this, n] : [
			this,
			n,
			X(t)
		], "substring");
	}
	arrayGet(e) {
		return new Z("array_get", [this, X(e)], "arrayGet");
	}
	isError() {
		return new Z("is_error", [this], "isError").asBoolean();
	}
	ifError(e) {
		let t = new Z("if_error", [this, X(e)], "ifError");
		return e instanceof hm ? t.asBoolean() : t;
	}
	isAbsent() {
		return new Z("is_absent", [this], "isAbsent").asBoolean();
	}
	mapRemove(e) {
		return new Z("map_remove", [this, X(e)], "mapRemove");
	}
	mapMerge(e, ...t) {
		let n = X(e), r = t.map(X);
		return new Z("map_merge", [
			this,
			n,
			...r
		], "mapMerge");
	}
	pow(e) {
		return new Z("pow", [this, X(e)]);
	}
	trunc(e) {
		return e === void 0 ? new Z("trunc", [this]) : new Z("trunc", [this, X(e)], "trunc");
	}
	round(e) {
		return e === void 0 ? new Z("round", [this]) : new Z("round", [this, X(e)], "round");
	}
	collectionId() {
		return new Z("collection_id", [this]);
	}
	length() {
		return new Z("length", [this]);
	}
	ln() {
		return new Z("ln", [this]);
	}
	sqrt() {
		return new Z("sqrt", [this]);
	}
	stringReverse() {
		return new Z("string_reverse", [this]);
	}
	ifAbsent(e) {
		return new Z("if_absent", [this, X(e)], "ifAbsent");
	}
	ifNull(e) {
		return new Z("if_null", [this, X(e)], "ifNull");
	}
	coalesce(e, ...t) {
		return new Z("coalesce", [
			this,
			X(e),
			...t.map(X)
		], "coalesce");
	}
	join(e) {
		return new Z("join", [this, X(e)], "join");
	}
	log10() {
		return new Z("log10", [this]);
	}
	arraySum() {
		return new Z("sum", [this]);
	}
	split(e) {
		return new Z("split", [this, X(e)]);
	}
	timestampTruncate(e, t) {
		let n = [this, X(e)];
		return t && n.push(X(t)), new Z("timestamp_trunc", n);
	}
	ascending() {
		return xm(this);
	}
	descending() {
		return Sm(this);
	}
	as(e) {
		return new sm(this, e, "as");
	}
}, am = class e {
	constructor(e, t) {
		this.name = e, this.params = t, this.exprType = "AggregateFunction", this._protoValueType = "ProtoValue";
	}
	static _create(t, n, r) {
		let i = new e(t, n);
		return i._methodName = r, i;
	}
	as(e) {
		return new om(this, e, "as");
	}
	_toProto(e) {
		return { functionValue: {
			name: this.name,
			args: this.params.map(((t) => t._toProto(e)))
		} };
	}
	_readUserData(e) {
		e = this._methodName ? e.contextWith({ methodName: this._methodName }) : e, this.params.forEach(((t) => t._readUserData(e)));
	}
}, om = class {
	constructor(e, t, n) {
		this.aggregate = e, this.alias = t, this._methodName = n;
	}
	_readUserData(e) {
		this.aggregate._readUserData(e);
	}
}, sm = class {
	constructor(e, t, n) {
		this.expr = e, this.alias = t, this._methodName = n, this.exprType = "AliasedExpression", this.selectable = !0;
	}
	_readUserData(e) {
		this.expr._readUserData(e);
	}
}, cm = class extends im {
	constructor(e, t) {
		super(), this.cr = e, this._methodName = t, this.expressionType = "ListOfExpressions";
	}
	_toProto(e) {
		return { arrayValue: { values: this.cr.map(((t) => t._toProto(e))) } };
	}
	_readUserData(e) {
		this.cr.forEach(((t) => t._readUserData(e)));
	}
}, lm = class extends im {
	constructor(e, t) {
		super(), this.fieldPath = e, this._methodName = t, this.expressionType = "Field", this.selectable = !0;
	}
	get _fieldPath() {
		return this.fieldPath;
	}
	get fieldName() {
		return this.fieldPath.canonicalString();
	}
	get alias() {
		return this.fieldName;
	}
	get expr() {
		return this;
	}
	geoDistance(e) {
		return new Z("geo_distance", [this, X(e)], "geoDistance");
	}
	_toProto(e) {
		return { fieldReferenceValue: this.fieldPath.canonicalString() };
	}
	_readUserData(e) {}
};
function um(e) {
	return dm(e, "field");
}
function dm(e, t) {
	return new lm(typeof e == "string" ? zc === e ? Cf()._internalPath : Kp("field", e) : e._internalPath, t);
}
var fm = class e extends im {
	constructor(e, t) {
		super(), this.value = e, this._methodName = t, this.expressionType = "Constant";
	}
	static _fromProto(t) {
		let n = new e(t, void 0);
		return n._protoValue = t, n;
	}
	_toProto(e) {
		return L(this._protoValue !== void 0, 237), this._protoValue;
	}
	_getValue() {
		return this._protoValue;
	}
	_readUserData(e) {
		e = this._methodName ? e.contextWith({ methodName: this._methodName }) : e, $p(this._protoValue) || (this._protoValue = Vp(this.value, e));
	}
};
function pm(e, t) {
	return mm(e, "constant");
}
function mm(e, t) {
	let n = new fm(e, t);
	return typeof e == "boolean" ? new _m(n) : n;
}
var Z = class extends im {
	constructor(e, t, n, r) {
		super(), this.name = e, this.params = t, this.expressionType = "Function", this._optionsProto = void 0, n !== void 0 && (this._methodName = n), r !== void 0 && (this._options = r);
	}
	get _optionsUtil() {
		return new Qp({});
	}
	_toProto(e) {
		let t = { functionValue: {
			name: this.name,
			args: this.params.map(((t) => t._toProto(e)))
		} };
		return this._optionsProto && (t.functionValue.options = this._optionsProto), t;
	}
	_readUserData(e) {
		e = this._methodName ? e.contextWith({ methodName: this._methodName }) : e, this.params.forEach(((t) => t._readUserData(e))), this._options && (this._optionsProto = this._optionsUtil.getOptionsProto(e, this._options));
	}
}, hm = class e extends im {
	get _methodName() {
		return this._expr._methodName;
	}
	countIf() {
		return am._create("count_if", [this], "countIf");
	}
	not() {
		return new Z("not", [this], "not").asBoolean();
	}
	conditional(e, t) {
		return new Z("conditional", [
			this,
			e,
			t
		], "conditional");
	}
	ifError(t) {
		let n = X(t), r = new Z("if_error", [this, n], "ifError");
		return n instanceof e ? r.asBoolean() : r;
	}
	_toProto(e) {
		return this._expr._toProto(e);
	}
	_readUserData(e) {
		this._expr._readUserData(e);
	}
}, gm = class extends hm {
	constructor(e) {
		super(), this._expr = e, this.expressionType = "Function";
	}
}, _m = class extends hm {
	constructor(e) {
		super(), this._expr = e, this.expressionType = "Constant";
	}
	_getValue() {
		return this._expr._getValue();
	}
}, vm = class extends hm {
	constructor(e) {
		super(), this._expr = e, this.expressionType = "Field";
	}
};
function ym(e, t) {
	let n = [];
	for (let t in e) if (Object.prototype.hasOwnProperty.call(e, t)) {
		let r = e[t];
		n.push(pm(t)), n.push(X(r));
	}
	return new Z("map", n, "map");
}
function bm(e) {
	return function(e, t) {
		return new Z("array", e.map(((e) => X(e))), t);
	}(e, "array");
}
function xm(e) {
	return new Cm(rm(e), "ascending", "ascending");
}
function Sm(e) {
	return new Cm(rm(e), "descending", "descending");
}
var Cm = class {
	constructor(e, t, n) {
		this.expr = e, this.direction = t, this._methodName = n, this._protoValueType = "ProtoValue";
	}
	_toProto(e) {
		return { mapValue: { fields: {
			direction: yf(this.direction),
			expression: this.expr._toProto(e)
		} } };
	}
	_readUserData(e) {
		this.expr._readUserData(e);
	}
}, wm = class {
	constructor(e) {
		this.optionsProto = void 0, {rawOptions: this.rawOptions, ...this.knownOptions} = e;
	}
	_readUserData(e) {
		this.optionsProto = this._optionsUtil.getOptionsProto(e, this.knownOptions, this.rawOptions);
	}
	_toProto(e) {
		return {
			name: this._name,
			options: this.optionsProto
		};
	}
}, Tm = class extends wm {
	get _name() {
		return "add_fields";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	constructor(e, t) {
		super(t), this.fields = e;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: [vf(e, this.fields)]
		};
	}
	_readUserData(e) {
		super._readUserData(e), Rm(this.fields, e);
	}
}, Em = class extends wm {
	get _name() {
		return "aggregate";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	constructor(e, t, n) {
		super(n), this.groups = e, this.accumulators = t;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: [vf(e, this.accumulators), vf(e, this.groups)]
		};
	}
	_readUserData(e) {
		super._readUserData(e), Rm(this.groups, e), Rm(this.accumulators, e);
	}
}, Dm = class extends wm {
	get _name() {
		return "distinct";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	constructor(e, t) {
		super(t), this.groups = e;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: [vf(e, this.groups)]
		};
	}
	_readUserData(e) {
		super._readUserData(e), Rm(this.groups, e);
	}
}, Om = class extends wm {
	get _name() {
		return "collection";
	}
	get _optionsUtil() {
		return new Qp({ forceIndex: { serverName: "force_index" } });
	}
	constructor(e, t) {
		super(t), this.hr = e.startsWith("/") ? e : "/" + e;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: [{ referenceValue: this.hr }]
		};
	}
	_readUserData(e) {
		super._readUserData(e);
	}
}, km = class extends wm {
	get _name() {
		return "collection_group";
	}
	get _optionsUtil() {
		return new Qp({ forceIndex: { serverName: "force_index" } });
	}
	constructor(e, t) {
		super(t), this.collectionId = e;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: [{ referenceValue: "" }, { stringValue: this.collectionId }]
		};
	}
	_readUserData(e) {
		super._readUserData(e);
	}
}, Am = class extends wm {
	get _name() {
		return "database";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	_toProto(e) {
		return { ...super._toProto(e) };
	}
	_readUserData(e) {
		super._readUserData(e);
	}
}, jm = class extends wm {
	get _name() {
		return "documents";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	constructor(e, t) {
		if (super(t), !e || e.length === 0) throw new V(B.INVALID_ARGUMENT, "Empty document paths are not allowed in DocumentsSource");
		let n = e.map(((e) => e.startsWith("/") ? e : "/" + e)), r = new Set(n);
		if (r.size !== n.length) throw new V(B.INVALID_ARGUMENT, "Duplicate document paths are not allowed in DocumentsSource");
		this.Tr = n, this.Pr = r;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: this.Tr.map(((e) => ({ referenceValue: e })))
		};
	}
	_readUserData(e) {
		super._readUserData(e);
	}
}, Mm = class extends wm {
	get _name() {
		return "where";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	constructor(e, t) {
		super(t), this.condition = e;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: [this.condition._toProto(e)]
		};
	}
	_readUserData(e) {
		super._readUserData(e), Rm(this.condition, e);
	}
}, Nm = class extends wm {
	get _name() {
		return "limit";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	constructor(e, t) {
		L(!isNaN(e) && e !== 1 / 0 && e !== -1 / 0, 34860), super(t), this.limit = e;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: [ru(e, this.limit)]
		};
	}
}, Pm = class extends wm {
	get _name() {
		return "offset";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	constructor(e, t) {
		super(t), this.offset = e;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: [ru(e, this.offset)]
		};
	}
}, Fm = class extends wm {
	get _name() {
		return "select";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	constructor(e, t) {
		super(t), this.selections = e;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: [vf(e, this.selections)]
		};
	}
	_readUserData(e) {
		super._readUserData(e), Rm(this.selections, e);
	}
}, Im = class extends wm {
	get _name() {
		return "sort";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	constructor(e, t) {
		super(t), this.orderings = e;
	}
	_toProto(e) {
		return {
			...super._toProto(e),
			args: this.orderings.map(((t) => t._toProto(e)))
		};
	}
	_readUserData(e) {
		super._readUserData(e), Rm(this.orderings, e);
	}
}, Lm = class e extends wm {
	get _name() {
		return "replace_with";
	}
	get _optionsUtil() {
		return new Qp({});
	}
	constructor(e, t) {
		super(t), this.map = e;
	}
	_toProto(t) {
		return {
			...super._toProto(t),
			args: [this.map._toProto(t), yf(e.Ir)]
		};
	}
	_readUserData(e) {
		super._readUserData(e), Rm(this.map, e);
	}
};
Lm.Ir = "full_replace";
function Rm(e, t) {
	return Zp(e) ? e._readUserData(t) : Array.isArray(e) || e instanceof Map ? e.forEach(((e) => e._readUserData(t))) : Object.values(e).forEach(((e) => e._readUserData(t))), e;
}
var zm = class {
	constructor(e, t, n) {
		this.serializer = e, this.stages = t, this.listenOptions = n, this.isCorePipeline = !0;
	}
	getPipelineCollection() {
		return Vm(this);
	}
	getPipelineCollectionGroup() {
		return Hm(this);
	}
	getPipelineCollectionId() {
		return Um(this);
	}
	getPipelineDocuments() {
		return Wm(this);
	}
	getPipelineFlavor() {
		return function(e) {
			let t = "exact";
			return e.stages.forEach(((n, r) => {
				n._name !== Dm.name && n._name !== Em.name || (t = "keyless"), n._name === Fm.name && t === "exact" && (t = "augmented"), n._name === Tm.name && r < e.stages.length - 1 && t === "exact" && (t = "augmented");
			})), t;
		}(this);
	}
	getPipelineSourceType() {
		return Bm(this);
	}
};
function Bm(e) {
	let t = e.stages[0];
	return t instanceof Om || t instanceof km || t instanceof Am || t instanceof jm ? t._name : "unknown";
}
function Vm(e) {
	if (Bm(e) === "collection") return e.stages[0].hr;
}
function Hm(e) {
	if (Bm(e) === "collection_group") return e.stages[0].collectionId;
}
function Um(e) {
	switch (Bm(e)) {
		case "collection": return H.fromString(Vm(e)).lastSegment();
		case "collection_group": return Hm(e);
		default: return;
	}
}
function Wm(e) {
	if (Bm(e) === "documents") return e.stages[0].Tr;
}
var Q = class e {
	constructor(e, t) {
		this.type = e, this.value = t;
	}
	static mr() {
		return new e("ERROR", void 0);
	}
	static pr() {
		return new e("UNSET", void 0);
	}
	static gr() {
		return new e("NULL", Al);
	}
	static newValue(t) {
		return Kl(t) ? new e("NULL", Al) : function(e) {
			return !!e && "booleanValue" in e;
		}(t) ? new e("BOOLEAN", t) : Hl(t) ? new e("INT", t) : Ul(t) ? new e("DOUBLE", t) : function(e) {
			return !!e && "timestampValue" in e && !!e.timestampValue;
		}(t) ? new e("TIMESTAMP", t) : function(e) {
			return !!e && "stringValue" in e;
		}(t) ? new e("STRING", t) : function(e) {
			return !!e && "bytesValue" in e;
		}(t) ? new e("BYTES", t) : t.referenceValue ? new e("REFERENCE", t) : t.geoPointValue ? new e("GEO_POINT", t) : Gl(t) ? new e("ARRAY", t) : Yl(t) ? new e("VECTOR", t) : Jl(t) ? new e("MAP", t) : new e("ERROR", void 0);
	}
	yr() {
		return this.type === "ERROR" || this.type === "UNSET";
	}
	wr() {
		return this.type === "NULL";
	}
};
function Gm(e) {
	if (!e.yr()) return e.value;
}
function Km(e) {
	return e instanceof hm ? e._expr : e;
}
function $(e) {
	if ((e = Km(e)) instanceof lm) return new qm(e);
	if (e instanceof fm) return new Jm(e);
	if (e instanceof cm) return new Ym(e);
	if (e instanceof Z) {
		if (e.name === "add") return new nh(e);
		if (e.name === "subtract") return new rh(e);
		if (e.name === "multiply") return new ih(e);
		if (e.name === "divide") return new ah(e);
		if (e.name === "mod") return new oh(e);
		if (e.name === "and") return new sh(e);
		if (e.name === "equal") return new Ch(e);
		if (e.name === "not_equal") return new wh(e);
		if (e.name === "less_than") return new Th(e);
		if (e.name === "less_than_or_equal") return new Eh(e);
		if (e.name === "greater_than") return new Dh(e);
		if (e.name === "greater_than_or_equal") return new Oh(e);
		if (e.name === "array_concat") return new kh(e);
		if (e.name === "array_reverse") return new Ah(e);
		if (e.name === "array_contains") return new jh(e);
		if (e.name === "array_contains_all") return new Mh(e);
		if (e.name === "array_contains_any") return new Nh(e);
		if (e.name === "array_length") return new Ph(e);
		if (e.name === "array_element") return new Fh(e);
		if (e.name === "equal_any") return new dh(e);
		if (e.name === "not_equal_any") return new fh(e);
		if (e.name === "is_nan") return new ph(e);
		if (e.name === "is_not_nan") return new mh(e);
		if (e.name === "is_null") return new hh(e);
		if (e.name === "is_not_null") return new gh(e);
		if (e.name === "is_error") return new _h(e);
		if (e.name === "exists") return new vh(e);
		if (e.name === "not") return new ch(e);
		if (e.name === "or") return new lh(e);
		if (e.name === "xor") return new uh(e);
		if (e.name === "conditional") return new yh(e);
		if (e.name === "maximum") return new bh(e);
		if (e.name === "minimum") return new xh(e);
		if (e.name === "reverse") return new Ih(e);
		if (e.name === "replace_first") return new Lh(e);
		if (e.name === "replace_all") return new Rh(e);
		if (e.name === "char_length") return new zh(e);
		if (e.name === "byte_length") return new Bh(e);
		if (e.name === "like") return new Hh(e);
		if (e.name === "regex_contains") return new Uh(e);
		if (e.name === "regex_match") return new Wh(e);
		if (e.name === "string_contains") return new Gh(e);
		if (e.name === "starts_with") return new Kh(e);
		if (e.name === "ends_with") return new qh(e);
		if (e.name === "to_lower") return new Jh(e);
		if (e.name === "to_upper") return new Yh(e);
		if (e.name === "trim") return new Xh(e);
		if (e.name === "string_concat") return new Zh(e);
		if (e.name === "map_get") return new Qh(e);
		if (e.name === "cosine_distance") return new eg(e);
		if (e.name === "dot_product") return new tg(e);
		if (e.name === "euclidean_distance") return new ng(e);
		if (e.name === "vector_length") return new rg(e);
		if (e.name === "unix_micros_to_timestamp") return new vg(e);
		if (e.name === "timestamp_to_unix_micros") return new Sg(e);
		if (e.name === "unix_millis_to_timestamp") return new yg(e);
		if (e.name === "timestamp_to_unix_millis") return new Cg(e);
		if (e.name === "unix_seconds_to_timestamp") return new bg(e);
		if (e.name === "timestamp_to_unix_seconds") return new wg(e);
		if (e.name === "timestamp_add") return new Eg(e);
		if (e.name === "timestamp_subtract") return new Dg(e);
	}
	throw Error(`Unknown Expr : ${e}`);
}
var qm = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		if (this.expr.fieldName === zc) return Q.newValue({ referenceValue: af(e.serializer, t.key) });
		if (this.expr.fieldName === "__update_time__") return Q.newValue({ timestampValue: $d(e.serializer, t.version) });
		if (this.expr.fieldName === "__create_time__") return Q.newValue({ timestampValue: $d(e.serializer, t.createTime) });
		let n = t.data.field(this.expr._fieldPath);
		return n ? pl(n) ? Q.newValue(function(e, t) {
			if (e.serverTimestampBehavior === "estimate") return { timestampValue: $d(e.serializer, q.fromTimestamp(hl(t))) };
			if (e.serverTimestampBehavior === "previous") {
				let e = ml(t);
				if (e) return e;
			}
			return { nullValue: "NULL_VALUE" };
		}(e, n)) : Q.newValue(n) : Q.pr();
	}
}, Jm = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		return Q.newValue(this.expr._getValue());
	}
}, Ym = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		let n = this.expr.cr.map(((n) => $(n).evaluate(e, t)));
		return n.some(((e) => e.yr())) ? Q.mr() : Q.newValue({ arrayValue: { values: n.map(((e) => e.value)) } });
	}
};
function Xm(e) {
	return Ul(e) ? Number(e.doubleValue) : Number(e.integerValue);
}
function Zm(e) {
	return BigInt(e.integerValue);
}
var Qm = BigInt("0x7fffffffffffffff"), $m = -BigInt("0x8000000000000000"), eh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length >= 2, 24778);
		let n = $(this.expr.params[0]).evaluate(e, t), r = $(this.expr.params[1]).evaluate(e, t), i = this.br(n, r);
		for (let n of this.expr.params.slice(2)) {
			let r = $(n).evaluate(e, t);
			i = this.br(i, r);
		}
		return i;
	}
	br(e, t) {
		if (e.yr() || t.yr()) return Q.mr();
		if (e.wr() || t.wr()) return Q.gr();
		let n = e.value, r = t.value;
		if (!Ul(n) && !Hl(n) || !Ul(r) && !Hl(r)) return Q.mr();
		if (Ul(n) || Ul(r)) {
			let e = this.Sr(n, r);
			return e ? Q.newValue(e) : Q.mr();
		}
		if (Hl(n) && Hl(r)) {
			let e = this.vr(n, r);
			return e === void 0 ? Q.mr() : typeof e == "number" ? Q.newValue({ doubleValue: e }) : e < $m || e > Qm ? Q.mr() : Q.newValue({ integerValue: `${e}` });
		}
		return Q.mr();
	}
};
function th(e, t) {
	return Nl(e) === Nl(t) ? ql(e) || ql(t) ? "NOT_EQ" : Kl(e) && Kl(t) ? "EQ" : Kl(e) || Kl(t) ? "NULL" : Gl(e) && Gl(t) ? function(e, t) {
		if (e.values?.length !== t.values?.length) return "NOT_EQ";
		let n = !1;
		for (let r = 0; r < (e.values?.length ?? 0); r++) {
			let i = e.values[r], a = t.values[r];
			switch (th(i, a)) {
				case "EQ": break;
				case "NOT_EQ":
				case "TYPE_MISMATCH": return "NOT_EQ";
				case "NULL":
					n = !0;
					break;
				default: I(44609, {
					Dr: i,
					Cr: a
				});
			}
		}
		return n ? "NULL" : "EQ";
	}(e.arrayValue, t.arrayValue) : Yl(e) && Yl(t) || Jl(e) && Jl(t) ? function(e, t) {
		let n = e.fields || {}, r = t.fields || {};
		if (Wc(n) !== Wc(r)) return "NOT_EQ";
		let i = !1;
		for (let e in n) if (n.hasOwnProperty(e)) {
			if (r[e] === void 0) return "NOT_EQ";
			switch (th(n[e], r[e])) {
				case "NOT_EQ":
				case "TYPE_MISMATCH": return "NOT_EQ";
				case "NULL": i = !0;
			}
		}
		return i ? "NULL" : "EQ";
	}(e.mapValue, t.mapValue) : function(e, t) {
		return Pl(e, t, {
			u: !1,
			i: !0,
			o: !0
		});
	}(e, t) ? "EQ" : "NOT_EQ" : "TYPE_MISMATCH";
}
var nh = class extends eh {
	vr(e, t) {
		return Zm(e) + Zm(t);
	}
	Sr(e, t) {
		return { doubleValue: Xm(e) + Xm(t) };
	}
}, rh = class extends eh {
	constructor(e) {
		super(e), this.expr = e;
	}
	vr(e, t) {
		return Zm(e) - Zm(t);
	}
	Sr(e, t) {
		return { doubleValue: Xm(e) - Xm(t) };
	}
}, ih = class extends eh {
	constructor(e) {
		super(e), this.expr = e;
	}
	vr(e, t) {
		return Zm(e) * Zm(t);
	}
	Sr(e, t) {
		return { doubleValue: Xm(e) * Xm(t) };
	}
}, ah = class extends eh {
	constructor(e) {
		super(e), this.expr = e;
	}
	vr(e, t) {
		let n = Zm(t);
		if (n !== BigInt(0)) return Zm(e) / n;
	}
	Sr(e, t) {
		let n = Xm(t);
		return n === 0 ? { doubleValue: Sl(n) ? -Infinity : Infinity } : { doubleValue: Xm(e) / n };
	}
}, oh = class extends eh {
	constructor(e) {
		super(e), this.expr = e;
	}
	vr(e, t) {
		let n = Zm(t);
		if (n !== BigInt(0)) return Zm(e) % n;
	}
	Sr(e, t) {
		let n = Xm(t);
		if (n !== 0) return { doubleValue: Xm(e) % n };
	}
}, sh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		let n = !1, r = !1;
		for (let i of this.expr.params) {
			let a = $(i).evaluate(e, t);
			switch (a.type) {
				case "BOOLEAN":
					if (!a.value?.booleanValue) return Q.newValue(Ml);
					break;
				case "NULL":
					r = !0;
					break;
				default: n = !0;
			}
		}
		return n ? Q.mr() : r ? Q.gr() : Q.newValue(jl);
	}
}, ch = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 9634);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "BOOLEAN": return Q.newValue({ booleanValue: !n.value?.booleanValue });
			case "NULL": return Q.gr();
			default: return Q.mr();
		}
	}
}, lh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		let n = !1, r = !1;
		for (let i of this.expr.params) {
			let a = $(i).evaluate(e, t);
			switch (a.type) {
				case "BOOLEAN":
					if (a.value?.booleanValue) return Q.newValue(jl);
					break;
				case "NULL":
					r = !0;
					break;
				default: n = !0;
			}
		}
		return n ? Q.mr() : r ? Q.gr() : Q.newValue(Ml);
	}
}, uh = class e {
	constructor(e) {
		this.expr = e;
	}
	evaluate(t, n) {
		let r = !1, i = !1;
		for (let a of this.expr.params) {
			let o = $(a).evaluate(t, n);
			switch (o.type) {
				case "BOOLEAN":
					r = e.xor(r, !!o.value?.booleanValue);
					break;
				case "NULL":
					i = !0;
					break;
				default: return Q.mr();
			}
		}
		return i ? Q.gr() : Q.newValue({ booleanValue: r });
	}
	static xor(e, t) {
		return (e || t) && !(e && t);
	}
}, dh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 2, 55094);
		let n = !1, r = $(this.expr.params[0]).evaluate(e, t);
		switch (r.type) {
			case "NULL":
				n = !0;
				break;
			case "ERROR":
			case "UNSET": return Q.mr();
		}
		let i = $(this.expr.params[1]).evaluate(e, t);
		switch (i.type) {
			case "ARRAY": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		if (n) return Q.gr();
		for (let e of i.value?.arrayValue?.values ?? []) switch (Kl(r.value) && Kl(e) ? "EQ" : th(r.value, e)) {
			case "EQ": return Q.newValue(jl);
			case "NOT_EQ":
			case "TYPE_MISMATCH": break;
			case "NULL":
				n = !0;
				break;
			default: I(44608, {
				value: r.value,
				candidate: e
			});
		}
		return n ? Q.gr() : Q.newValue(Ml);
	}
}, fh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		return new ch(new Z("not", [new Z("equal_any", this.expr.params)])).evaluate(e, t);
	}
}, ph = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 23322);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "INT": return Q.newValue(Ml);
			case "DOUBLE": return Q.newValue({ booleanValue: isNaN(Xm(n.value)) });
			case "NULL": return Q.gr();
			default: return Q.mr();
		}
	}
}, mh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		return L(this.expr.params.length === 1, 50406), new ch(new Z("not", [new Z("is_nan", this.expr.params)])).evaluate(e, t);
	}
}, hh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		switch (L(this.expr.params.length === 1, 23123), $(this.expr.params[0]).evaluate(e, t).type) {
			case "NULL": return Q.newValue(jl);
			case "UNSET":
			case "ERROR": return Q.mr();
			default: return Q.newValue(Ml);
		}
	}
}, gh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		return L(this.expr.params.length === 1, 23167), new ch(new Z("not", [new Z("is_null", this.expr.params)])).evaluate(e, t);
	}
}, _h = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		return L(this.expr.params.length === 1, 5228), $(this.expr.params[0]).evaluate(e, t).type === "ERROR" ? Q.newValue(jl) : Q.newValue(Ml);
	}
}, vh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		switch (L(this.expr.params.length === 1, 6877), $(this.expr.params[0]).evaluate(e, t).type) {
			case "ERROR": return Q.mr();
			case "UNSET": return Q.newValue(Ml);
			default: return Q.newValue(jl);
		}
	}
}, yh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 3, 11706);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "BOOLEAN": return n.value?.booleanValue ? $(this.expr.params[1]).evaluate(e, t) : $(this.expr.params[2]).evaluate(e, t);
			case "NULL": return $(this.expr.params[2]).evaluate(e, t);
			default: return Q.mr();
		}
	}
}, bh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		let n = this.expr.params.map(((n) => $(n).evaluate(e, t))), r;
		for (let e of n) switch (e.type) {
			case "ERROR":
			case "UNSET":
			case "NULL": continue;
			default: r = r === void 0 || Il(e.value, r.value) > 0 ? e : r;
		}
		return r === void 0 ? Q.gr() : r;
	}
}, xh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		let n = this.expr.params.map(((n) => $(n).evaluate(e, t))), r;
		for (let e of n) switch (e.type) {
			case "ERROR":
			case "UNSET":
			case "NULL": continue;
			default: r = r === void 0 || Il(e.value, r.value) < 0 ? e : r;
		}
		return r === void 0 ? Q.gr() : r;
	}
}, Sh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 2, 31033, `${this.expr.name}() function should have exactly 2 params`);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "ERROR":
			case "UNSET": return Q.mr();
		}
		let r = $(this.expr.params[1]).evaluate(e, t);
		switch (r.type) {
			case "ERROR":
			case "UNSET": return Q.mr();
		}
		return this.Fr(n, r);
	}
}, Ch = class extends Sh {
	constructor(e) {
		super(e), this.expr = e;
	}
	Fr(e, t) {
		if (e.wr() && t.wr()) return Q.newValue(jl);
		if (e.wr() || t.wr() || ql(e.value) || ql(t.value) || Nl(e.value) !== Nl(t.value)) return Q.newValue(Ml);
		switch (th(e.value, t.value)) {
			case "EQ": return Q.newValue(jl);
			case "NOT_EQ": return Q.newValue(Ml);
			case "NULL": return Q.gr();
			default: I(44615, {
				left: e,
				right: t
			});
		}
	}
}, wh = class extends Sh {
	constructor(e) {
		super(e), this.expr = e;
	}
	Fr(e, t) {
		switch (th(e.value, t.value)) {
			case "EQ": return Q.newValue(Ml);
			case "NOT_EQ":
			case "TYPE_MISMATCH": return Q.newValue(jl);
			case "NULL": return Q.gr();
			default: I(44614, {
				left: e,
				right: t
			});
		}
	}
}, Th = class extends Sh {
	constructor(e) {
		super(e), this.expr = e;
	}
	Fr(e, t) {
		return Nl(e.value) !== Nl(t.value) || ql(e.value) || ql(t.value) ? Q.newValue(Ml) : Q.newValue({ booleanValue: Il(e.value, t.value) < 0 });
	}
}, Eh = class extends Sh {
	constructor(e) {
		super(e), this.expr = e;
	}
	Fr(e, t) {
		return Nl(e.value) !== Nl(t.value) || ql(e.value) || ql(t.value) ? Q.newValue(Ml) : th(e.value, t.value) === "EQ" ? Q.newValue(jl) : Q.newValue({ booleanValue: Il(e.value, t.value) < 0 });
	}
}, Dh = class extends Sh {
	constructor(e) {
		super(e), this.expr = e;
	}
	Fr(e, t) {
		return Nl(e.value) !== Nl(t.value) || ql(e.value) || ql(t.value) ? Q.newValue(Ml) : Q.newValue({ booleanValue: Il(e.value, t.value) > 0 });
	}
}, Oh = class extends Sh {
	constructor(e) {
		super(e), this.expr = e;
	}
	Fr(e, t) {
		return Nl(e.value) !== Nl(t.value) || ql(e.value) || ql(t.value) ? Q.newValue(Ml) : th(e.value, t.value) === "EQ" ? Q.newValue(jl) : Q.newValue({ booleanValue: Il(e.value, t.value) > 0 });
	}
}, kh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		throw Error("Unimplemented");
	}
}, Ah = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 216);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "NULL": return Q.gr();
			case "ARRAY": {
				let e = n.value.arrayValue?.values ?? [];
				return Q.newValue({ arrayValue: { values: [...e].reverse() } });
			}
			default: return Q.mr();
		}
	}
}, jh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		return L(this.expr.params.length === 2, 52884), new dh(new Z("eq_any", [this.expr.params[1], this.expr.params[0]])).evaluate(e, t);
	}
}, Mh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 2, 1392);
		let n = !1, r = $(this.expr.params[0]).evaluate(e, t);
		switch (r.type) {
			case "ARRAY": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		let i = $(this.expr.params[1]).evaluate(e, t);
		switch (i.type) {
			case "ARRAY": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		if (n) return Q.gr();
		let a = i.value?.arrayValue?.values ?? [], o = r.value?.arrayValue?.values ?? [];
		for (let e of a) {
			let t = !1;
			n = !1;
			for (let r of o) {
				switch (Kl(e) && Kl(r) ? "EQ" : th(e, r)) {
					case "EQ":
						t = !0;
						break;
					case "NOT_EQ":
					case "TYPE_MISMATCH": break;
					case "NULL":
						n = !0;
						break;
					default: I(44613, {
						value: r,
						search: e
					});
				}
				if (t) break;
			}
			if (!t) return Q.newValue(Ml);
		}
		return Q.newValue(jl);
	}
}, Nh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 2, 2680);
		let n = !1, r = $(this.expr.params[0]).evaluate(e, t);
		switch (r.type) {
			case "ARRAY": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		let i = $(this.expr.params[1]).evaluate(e, t);
		switch (i.type) {
			case "ARRAY": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		if (n) return Q.gr();
		let a = i.value?.arrayValue?.values ?? [], o = r.value?.arrayValue?.values ?? [];
		for (let e of o) for (let t of a) switch (Kl(e) && Kl(t) ? "EQ" : th(e, t)) {
			case "EQ": return Q.newValue(jl);
			case "NOT_EQ":
			case "TYPE_MISMATCH": break;
			case "NULL":
				n = !0;
				break;
			default: I(60403, {
				value: e,
				search: t
			});
		}
		return n ? Q.gr() : Q.newValue(Ml);
	}
}, Ph = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 38605);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "NULL": return Q.gr();
			case "ARRAY": return Q.newValue({ integerValue: `${n.value?.arrayValue?.values?.length ?? 0}` });
			default: return Q.mr();
		}
	}
}, Fh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		throw Error("Unimplemented");
	}
}, Ih = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 1508);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "NULL": return Q.gr();
			case "BYTES": {
				let e = n.value?.bytesValue;
				if (typeof e == "string") {
					let t = al.fromBase64String(e).toUint8Array();
					return t.reverse(), Q.newValue({ bytesValue: al.fromUint8Array(t).toBase64() });
				}
				return Q.newValue({ bytesValue: new Uint8Array(e).reverse() });
			}
			case "STRING": {
				let e = n.value?.stringValue, t = new Intl.__PRIVATE_Segmenter(void 0, { granularity: "grapheme" }).segment(e), r = Array.from(t, ((e) => e.segment)).reverse();
				return Q.newValue({ stringValue: r.join("") });
			}
			default: return Q.mr();
		}
	}
}, Lh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		throw Error("Unimplemented");
	}
}, Rh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		throw Error("Unimplemented");
	}
}, zh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 19400);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "NULL": return Q.gr();
			case "STRING": {
				let e = function(e) {
					let t = 0;
					for (let n = 0; n < e.length; n++) {
						let r = e.codePointAt(n);
						if (r === void 0) return;
						if (r <= 65535) {
							if (r >= 55296 && r <= 57343) {
								if (r <= 56319) {
									let r = e.codePointAt(n + 1);
									r !== void 0 && r >= 56320 && r <= 57343 ? (t += 1, n++) : t += 1;
								} else t += 1;
							} else t += 1;
						} else {
							if (!(r <= 1114111)) return;
							t += 1, n++;
						}
					}
					return t;
				}(n.value.stringValue);
				return e === void 0 ? Q.mr() : Q.newValue({ integerValue: e });
			}
			default: return Q.mr();
		}
	}
}, Bh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 8486);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "BYTES": {
				let e = n.value?.bytesValue;
				return typeof e == "string" ? Q.newValue({ integerValue: al.fromBase64String(e).toUint8Array().length }) : Q.newValue({ integerValue: new Uint8Array(e).length });
			}
			case "STRING": {
				let e = function(e) {
					let t = 0;
					for (let n = 0; n < e.length; n++) {
						let r = e.codePointAt(n);
						if (r === void 0) return;
						if (r >= 55296 && r <= 57343) {
							if (!(r <= 56319)) return;
							{
								let r = e.codePointAt(n + 1);
								if (r === void 0 || !(r >= 56320 && r <= 57343)) return;
								t += 4, n++;
							}
						} else if (r <= 127) t += 1;
						else if (r <= 2047) t += 2;
						else if (r <= 65535) t += 3;
						else {
							if (!(r <= 1114111)) return;
							t += 4, n++;
						}
					}
					return t;
				}(n.value?.stringValue);
				return e === void 0 ? Q.mr() : Q.newValue({ integerValue: e });
			}
			case "NULL": return Q.gr();
			default: return Q.mr();
		}
	}
}, Vh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 2, 39773, `${this.expr.name}() function should have exactly two parameters`);
		let n = !1, r = $(this.expr.params[0]).evaluate(e, t);
		switch (r.type) {
			case "STRING": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		let i = $(this.expr.params[1]).evaluate(e, t);
		switch (i.type) {
			case "STRING": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		return n ? Q.gr() : this.Or(r.value?.stringValue, i.value?.stringValue);
	}
}, Hh = class extends Vh {
	Or(e, t) {
		try {
			let n = function(e) {
				let t = "";
				for (let n = 0; n < e.length; n++) {
					let r = e.charAt(n);
					switch (r) {
						case "_":
							t += ".";
							break;
						case "%":
							t += ".*";
							break;
						case "\\":
						case ".":
						case "*":
						case "?":
						case "+":
						case "^":
						case "$":
						case "|":
						case "(":
						case ")":
						case "[":
						case "]":
						case "{":
						case "}":
							t += "\\" + r;
							break;
						default: t += r;
					}
				}
				return "^" + t + "$";
			}(t), r = vc.compile(n);
			return Q.newValue({ booleanValue: r.matches(e) });
		} catch (e) {
			return wc(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${e}`), Q.mr();
		}
	}
}, Uh = class extends Vh {
	Or(e, t) {
		try {
			let n = vc.compile(t);
			return Q.newValue({ booleanValue: n.test(e) });
		} catch {
			return wc(`Invalid regex pattern found in regex_contains: ${t}, returning error`), Q.mr();
		}
	}
}, Wh = class extends Vh {
	Or(e, t) {
		try {
			return Q.newValue({ booleanValue: vc.compile(t).matches(e) });
		} catch {
			return wc(`Invalid regex pattern found in regex_match: ${t}, returning error`), Q.mr();
		}
	}
}, Gh = class extends Vh {
	Or(e, t) {
		return Q.newValue({ booleanValue: e.includes(t) });
	}
}, Kh = class extends Vh {
	Or(e, t) {
		return Q.newValue({ booleanValue: e.startsWith(t) });
	}
}, qh = class extends Vh {
	Or(e, t) {
		return Q.newValue({ booleanValue: e.endsWith(t) });
	}
}, Jh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 29079);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "STRING": return Q.newValue({ stringValue: n.value?.stringValue?.toLowerCase() });
			case "NULL": return Q.gr();
			default: return Q.mr();
		}
	}
}, Yh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 60487);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "STRING": return Q.newValue({ stringValue: n.value?.stringValue?.toUpperCase() });
			case "NULL": return Q.gr();
			default: return Q.mr();
		}
	}
}, Xh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 28544);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "STRING": return Q.newValue({ stringValue: n.value?.stringValue?.trim() });
			case "NULL": return Q.gr();
			default: return Q.mr();
		}
	}
}, Zh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		let n = this.expr.params.map(((n) => $(n).evaluate(e, t))), r = "", i = !1;
		for (let e of n) switch (e.type) {
			case "STRING":
				r += e.value.stringValue;
				break;
			case "NULL":
				i = !0;
				break;
			default: return Q.mr();
		}
		return i ? Q.gr() : Q.newValue({ stringValue: r });
	}
}, Qh = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 2, 4483);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "UNSET": return Q.pr();
			case "MAP": break;
			default: return Q.mr();
		}
		let r = $(this.expr.params[1]).evaluate(e, t);
		if (r.type !== "STRING") return Q.mr();
		let i = n.value?.mapValue?.fields?.[r.value?.stringValue];
		return i === void 0 ? Q.pr() : Q.newValue(i);
	}
}, $h = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 2, 25231, `${this.expr.name}() function should have exactly 2 params`);
		let n = !1, r = $(this.expr.params[0]).evaluate(e, t);
		switch (r.type) {
			case "VECTOR": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		let i = $(this.expr.params[1]).evaluate(e, t);
		switch (i.type) {
			case "VECTOR": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		if (n) return Q.gr();
		let a = Xl(r.value), o = Xl(i.value);
		if (a === void 0 || o === void 0 || a.values?.length !== o.values?.length) return Q.mr();
		let s = this.Mr(a, o);
		return s === void 0 || isNaN(s) ? Q.mr() : Q.newValue({ doubleValue: s });
	}
}, eg = class extends $h {
	Mr(e, t) {
		let n = e?.values ?? [], r = t?.values ?? [];
		if (n.length === 0) return;
		let i = 0, a = 0, o = 0;
		for (let e = 0; e < n.length; e++) {
			if (!Wl(n[e]) || !Wl(r[e])) return;
			let t = Xm(n[e]), s = Xm(r[e]);
			i += t * s, a += t * t, o += s * s;
		}
		let s = Math.sqrt(a) * Math.sqrt(o);
		if (s !== 0) return 1 - Math.max(-1, Math.min(1, i / s));
	}
}, tg = class extends $h {
	Mr(e, t) {
		let n = e?.values ?? [], r = t?.values ?? [];
		if (n.length === 0) return 0;
		let i = 0;
		for (let e = 0; e < n.length; e++) {
			if (!Wl(n[e]) || !Wl(r[e])) return;
			i += Xm(n[e]) * Xm(r[e]);
		}
		return i;
	}
}, ng = class extends $h {
	Mr(e, t) {
		let n = e?.values ?? [], r = t?.values ?? [];
		if (n.length === 0) return 0;
		let i = 0;
		for (let e = 0; e < n.length; e++) {
			if (!Wl(n[e]) || !Wl(r[e])) return;
			let t = Xm(n[e]), a = Xm(r[e]);
			i += (t - a) ** 2;
		}
		return Math.sqrt(i);
	}
}, rg = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 39044);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "VECTOR": {
				let e = Xl(n.value);
				return Q.newValue({ integerValue: e?.values?.length ?? 0 });
			}
			case "NULL": return Q.gr();
			default: return Q.mr();
		}
	}
}, ig = BigInt(-62135596800), ag = BigInt(253402300799), og = BigInt(1e3), sg = BigInt(1e6), cg = ig * og, lg = ag * og + BigInt(999), ug = ig * sg, dg = ag * sg + BigInt(999999);
function fg(e) {
	return e >= ug && e <= dg;
}
function pg(e) {
	return e >= ig && e <= ag;
}
function mg(e, t) {
	let n = BigInt(e);
	return !(n < ig || n > ag) && !(t < 0 || t >= 1e9) && (n !== ig || t === 0) && !(n === ag && t > 999999999);
}
function hg(e, t) {
	return t < 0 ? {
		seconds: e - 1,
		nanos: t + 1e9
	} : {
		seconds: e,
		nanos: t
	};
}
function gg(e) {
	return BigInt(e.seconds) * sg + BigInt(Math.trunc(e.nanoseconds / 1e3));
}
var _g = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 49262, `${this.expr.name}() function should have exactly one parameter`);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "INT": return this.toTimestamp(BigInt(n.value.integerValue));
			case "NULL": return Q.gr();
			default: return Q.mr();
		}
	}
}, vg = class extends _g {
	toTimestamp(e) {
		if (!fg(e)) return Q.mr();
		let t = Number(e / sg), n = Number(e % sg * BigInt(1e3)), r = hg(t, n);
		return t = r.seconds, n = r.nanos, mg(t, n) ? Q.newValue({ timestampValue: {
			seconds: t,
			nanos: n
		} }) : Q.mr();
	}
}, yg = class extends _g {
	toTimestamp(e) {
		if (!function(e) {
			return e >= cg && e <= lg;
		}(e)) return Q.mr();
		let t = Number(e / og), n = Number(e % og * BigInt(1e6)), r = hg(t, n);
		return t = r.seconds, n = r.nanos, mg(t, n) ? Q.newValue({ timestampValue: {
			seconds: t,
			nanos: n
		} }) : Q.mr();
	}
}, bg = class extends _g {
	toTimestamp(e) {
		if (!pg(e)) return Q.mr();
		let t = Number(e);
		return Q.newValue({ timestampValue: {
			seconds: t,
			nanos: 0
		} });
	}
}, xg = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 1, 1265, `${this.expr.name}() function should have exactly one parameter`);
		let n = $(this.expr.params[0]).evaluate(e, t);
		switch (n.type) {
			case "TIMESTAMP": break;
			case "NULL": return Q.gr();
			default: return Q.mr();
		}
		let r = Zd(n.value.timestampValue);
		return mg(r.seconds, r.nanoseconds) ? this.Nr(r) : Q.mr();
	}
}, Sg = class extends xg {
	Nr(e) {
		let t = gg(e);
		return fg(t) ? Q.newValue({ integerValue: `${t.toString()}` }) : Q.mr();
	}
}, Cg = class extends xg {
	Nr(e) {
		let t = gg(e), n = t / BigInt(1e3), r = t % BigInt(1e3);
		return n > BigInt(0) || r === BigInt(0) ? Q.newValue({ integerValue: n.toString() }) : Q.newValue({ integerValue: (n - BigInt(1)).toString() });
	}
}, wg = class extends xg {
	Nr(e) {
		let t = BigInt(e.seconds);
		return pg(t) ? Q.newValue({ integerValue: t.toString() }) : Q.mr();
	}
}, Tg = class {
	constructor(e) {
		this.expr = e;
	}
	evaluate(e, t) {
		L(this.expr.params.length === 3, 2775, `${this.expr.name}() function should have exactly 3 parameters`);
		let n = !1, r = $(this.expr.params[0]).evaluate(e, t);
		switch (r.type) {
			case "TIMESTAMP": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		let i = $(this.expr.params[1]).evaluate(e, t), a;
		switch (i.type) {
			case "STRING":
				if (a = function(e) {
					switch (e) {
						case "microsecond": return "microsecond";
						case "millisecond": return "millisecond";
						case "second": return "second";
						case "minute": return "minute";
						case "hour": return "hour";
						case "day": return "day";
						default: return;
					}
				}(i.value.stringValue), a === void 0) return Q.mr();
				break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		let o = $(this.expr.params[2]).evaluate(e, t);
		switch (o.type) {
			case "INT": break;
			case "NULL":
				n = !0;
				break;
			default: return Q.mr();
		}
		if (n) return Q.gr();
		let s = BigInt(o.value.integerValue), c;
		try {
			switch (a) {
				case "microsecond":
					c = s;
					break;
				case "millisecond":
					c = s * BigInt(1e3);
					break;
				case "second":
					c = s * BigInt(1e6);
					break;
				case "minute":
					c = s * BigInt(6e7);
					break;
				case "hour":
					c = s * BigInt(36e8);
					break;
				case "day":
					c = s * BigInt(864e8);
					break;
				default: return Q.mr();
			}
			if (a !== "microsecond" && s !== BigInt(0) && c / s !== BigInt(this.Lr(a))) return Q.mr();
		} catch (e) {
			return wc(`Error during timestamp arithmetic: ${e}`), Q.mr();
		}
		let l = Zd(r.value.timestampValue);
		if (!mg(l.seconds, l.nanoseconds)) return Q.mr();
		let u = gg(l), d = this.Br(u, c);
		if (!fg(d)) return Q.mr();
		let f = Number(d / sg), p = d % sg, m = Number((p < 0 ? p + sg : p) * BigInt(1e3)), h = p < 0 ? f - 1 : f;
		return mg(h, m) ? Q.newValue({ timestampValue: {
			seconds: h,
			nanos: m
		} }) : Q.mr();
	}
	Lr(e) {
		switch (e) {
			case "millisecond": return 1e3;
			case "second": return 1e6;
			case "minute": return 6e7;
			case "hour": return 36e8;
			case "day": return 864e8;
			default: return 1;
		}
	}
}, Eg = class extends Tg {
	Br(e, t) {
		return e + t;
	}
}, Dg = class extends Tg {
	Br(e, t) {
		return e - t;
	}
};
function Og(e) {
	if ((e = Km(e)) instanceof lm) return `fld(${e.fieldName})`;
	if (e instanceof fm) return `cst(${function(e) {
		return e === null ? "null" : typeof e == "number" ? e.toString() : typeof e == "string" ? `"${e}"` : e instanceof Op ? `ref(${e.path})` : e instanceof Mp ? `vec(${JSON.stringify(e)})` : JSON.stringify(e);
	}(e.value)})`;
	if (e instanceof Z) return `fn(${e.name},[${e.params.map(Og).join(",")}])`;
	if (e.expressionType === "ListOfExpressions") return `list([${e.cr.map(Og).join(",")}])`;
	throw Error(`Unrecognized expr ${JSON.stringify(e, null, 2)}`);
}
function kg(e) {
	if (e instanceof Tm) return `${e._name}(${Ag(e.fields)})`;
	if (e instanceof Em) {
		let t = `${e._name}(${Ag(e.accumulators)})`;
		return e.groups.size > 0 && (t += `grouping(${Ag(e.groups)})`), t;
	}
	if (e instanceof Dm) return `${e._name}(${Ag(e.groups)})`;
	if (e instanceof Om) return `${e._name}(${e.hr})`;
	if (e instanceof km) return `${e._name}(${e.collectionId})`;
	if (e instanceof Am) return `${e._name}()`;
	if (e instanceof jm) return `${e._name}(${e.Tr.sort()})`;
	if (e instanceof Mm) return `${e._name}(${Og(e.condition)})`;
	if (e instanceof Nm) return `${e._name}(${e.limit})`;
	if (e instanceof Im) return `${e._name}(${function(e) {
		return e.map(((e) => `${Og(e.expr)}${e.direction}`)).join(",");
	}(e.orderings)})`;
	throw Error(`Unrecognized stage ${e._name}`);
}
function Ag(e) {
	return `${Array.from(e.entries()).sort().map((([e, t]) => `${e}=${Og(t)}`)).join(",")}`;
}
function jg(e) {
	return e.stages.map(((e) => kg(e))).join("|");
}
function Mg(e, t) {
	return jg(e) === jg(t);
}
function Ng(e) {
	return e instanceof zm;
}
function Pg(e) {
	return Ng(e) ? jg(e) : Od(e);
}
function Fg(e) {
	return Ng(e) ? jg(e) : function(e) {
		return `${md(wd(e))}|lt:${e.limitType}`;
	}(e);
}
function Ig(e, t) {
	return e instanceof zm && t instanceof zm ? Mg(e, t) : !(e instanceof zm && !(t instanceof zm) || !(e instanceof zm) && t instanceof zm) && Dd(e, t);
}
function Lg(e) {
	return gd(e) ? jg(e) : md(e);
}
function Rg(e, t) {
	return e instanceof zm && t instanceof zm ? Mg(e, t) : !(e instanceof zm && !(t instanceof zm) || !(e instanceof zm) && t instanceof zm) && hd(e, t);
}
var zg = class {
	constructor(e, t, n, r) {
		this.batchId = e, this.localWriteTime = t, this.baseMutations = n, this.mutations = r;
	}
	applyToRemoteDocument(e, t) {
		let n = t.mutationResults;
		for (let t = 0; t < this.mutations.length; t++) {
			let r = this.mutations[t];
			r.key.isEqual(e.key) && Du(r, e, n[t]);
		}
	}
	applyToLocalView(e, t) {
		for (let n of this.baseMutations) n.key.isEqual(e.key) && (t = Ou(n, e, t, this.localWriteTime));
		for (let n of this.mutations) n.key.isEqual(e.key) && (t = Ou(n, e, t, this.localWriteTime));
		return t;
	}
	applyToLocalDocumentSet(e, t) {
		let n = Hd();
		return this.mutations.forEach(((r) => {
			let i = e.get(r.key), a = i.overlayedDocument, o = this.applyToLocalView(a, i.mutatedFields);
			o = t.has(r.key) ? null : o;
			let s = Eu(a, o);
			s !== null && n.set(r.key, s), a.isValidDocument() || a.convertToNoDocument(q.min());
		})), n;
	}
	keys() {
		return this.mutations.reduce(((e, t) => e.add(t.key)), Kd());
	}
	isEqual(e) {
		return this.batchId === e.batchId && Nc(this.mutations, e.mutations, ((e, t) => Au(e, t))) && Nc(this.baseMutations, e.baseMutations, ((e, t) => Au(e, t)));
	}
}, Bg = class e {
	constructor(e, t, n, r) {
		this.batch = e, this.commitVersion = t, this.mutationResults = n, this.docVersions = r;
	}
	static from(t, n, r) {
		L(t.mutations.length === r.length, 58842, {
			Ur: t.mutations.length,
			kr: r.length
		});
		let i = function() {
			return Wd;
		}(), a = t.mutations;
		for (let e = 0; e < a.length; e++) i = i.insert(a[e].key, r[e].version);
		return new e(t, n, r, i);
	}
}, Vg = "";
function Hg(e) {
	let t = "";
	for (let n = 0; n < e.length; n++) t.length > 0 && (t = Wg(t)), t = Ug(e.get(n), t);
	return Wg(t);
}
function Ug(e, t) {
	let n = t, r = e.length;
	for (let t = 0; t < r; t++) {
		let r = e.charAt(t);
		switch (r) {
			case "\0":
				n += "";
				break;
			case Vg:
				n += "";
				break;
			default: n += r;
		}
	}
	return n;
}
function Wg(e) {
	return e + "";
}
var Gg = class {
	constructor(e, t) {
		this.largestBatchId = e, this.mutation = t;
	}
	getKey() {
		return this.mutation.key;
	}
	isEqual(e) {
		return e !== null && this.mutation === e.mutation;
	}
	toString() {
		return `Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`;
	}
}, Kg = class {
	constructor(e) {
		this.$r = e;
	}
};
function qg(e) {
	let t = ff({
		parent: e.parent,
		structuredQuery: e.structuredQuery
	});
	return e.limitType === "LAST" ? Ed(t, t.limit, "L") : t;
}
var Jg = class {
	constructor() {}
	ei(e, t) {
		this.ti(e, t), t.ni();
	}
	ti(e, t) {
		if ("nullValue" in e) this.ri(t, 5);
		else if ("booleanValue" in e) this.ri(t, 10), t.ii(+!!e.booleanValue);
		else if ("integerValue" in e) this.ri(t, 15), t.ii(K(e.integerValue));
		else if ("doubleValue" in e) {
			let n = K(e.doubleValue);
			isNaN(n) ? this.ri(t, 13) : (this.ri(t, 15), Sl(n) ? t.ii(0) : t.ii(n));
		} else if ("timestampValue" in e) {
			let n = e.timestampValue;
			this.ri(t, 20), typeof n == "string" && (n = sl(n)), t.si(`${n.seconds || ""}`), t.ii(n.nanos || 0);
		} else if ("stringValue" in e) this._i(e.stringValue, t), this.oi(t);
		else if ("bytesValue" in e) this.ri(t, 30), t.ai(cl(e.bytesValue)), this.oi(t);
		else if ("referenceValue" in e) this.ui(e.referenceValue, t);
		else if ("geoPointValue" in e) {
			let n = e.geoPointValue;
			this.ri(t, 45), t.ii(n.latitude || 0), t.ii(n.longitude || 0);
		} else "mapValue" in e ? Ql(e) ? this.ri(t, 2 ** 53 - 1) : Yl(e) ? this.ci(e.mapValue, t) : (this.li(e.mapValue, t), this.oi(t)) : "arrayValue" in e ? (this.Ei(e.arrayValue, t), this.oi(t)) : I(19022, { hi: e });
	}
	_i(e, t) {
		this.ri(t, 25), this.Ti(e, t);
	}
	Ti(e, t) {
		t.si(e);
	}
	li(e, t) {
		let n = e.fields || {};
		this.ri(t, 55);
		for (let e of Object.keys(n)) this._i(e, t), this.ti(n[e], t);
	}
	ci(e, t) {
		let n = e.fields || {};
		this.ri(t, 53);
		let r = kl, i = n[r].arrayValue?.values?.length || 0;
		this.ri(t, 15), t.ii(K(i)), this._i(r, t), this.ti(n[r], t);
	}
	Ei(e, t) {
		let n = e.values || [];
		this.ri(t, 50);
		for (let e of n) this.ti(e, t);
	}
	ui(e, t) {
		this.ri(t, 37), U.fromName(e).path.forEach(((e) => {
			this.ri(t, 60), this.Ti(e, t);
		}));
	}
	ri(e, t) {
		e.ii(t);
	}
	oi(e) {
		e.ii(2);
	}
};
Jg.Pi = new Jg();
var Yg = class {
	constructor() {
		this.Zi = new Xg();
	}
	addToCollectionParentIndex(e, t) {
		return this.Zi.add(t), Y.resolve();
	}
	getCollectionParents(e, t) {
		return Y.resolve(this.Zi.getEntries(t));
	}
	addFieldIndex(e, t) {
		return Y.resolve();
	}
	deleteFieldIndex(e, t) {
		return Y.resolve();
	}
	deleteAllFieldIndexes(e) {
		return Y.resolve();
	}
	createTargetIndexes(e, t) {
		return Y.resolve();
	}
	getDocumentsMatchingTarget(e, t) {
		return Y.resolve(null);
	}
	getIndexType(e, t) {
		return Y.resolve(0);
	}
	getFieldIndexes(e, t) {
		return Y.resolve([]);
	}
	getNextCollectionGroupToUpdate(e) {
		return Y.resolve(null);
	}
	getMinOffset(e, t) {
		return Y.resolve(ud.min());
	}
	getMinOffsetFromCollectionGroup(e, t) {
		return Y.resolve(ud.min());
	}
	updateCollectionGroup(e, t, n) {
		return Y.resolve();
	}
	updateIndexEntries(e, t) {
		return Y.resolve();
	}
}, Xg = class {
	constructor() {
		this.index = {};
	}
	add(e) {
		let t = e.lastSegment(), n = e.popLast(), r = this.index[t] || new Lc(H.comparator), i = !r.has(n);
		return this.index[t] = r.add(n), i;
	}
	has(e) {
		let t = e.lastSegment(), n = e.popLast(), r = this.index[t];
		return r && r.has(n);
	}
	getEntries(e) {
		return (this.index[e] || new Lc(H.comparator)).toArray();
	}
}, Zg = class e {
	constructor(e) {
		this.ys = e;
	}
	next() {
		return this.ys += 2, this.ys;
	}
	static ws() {
		return new e(0);
	}
	static bs() {
		return new e(-1);
	}
};
function Qg(e, t) {
	let n = t;
	for (let t of e.stages) n = e_({
		serializer: e.serializer,
		serverTimestampBehavior: e.listenOptions?.serverTimestampBehavior
	}, t, n);
	return n;
}
function $g(e, t) {
	return Qg(e, [t]).length > 0;
}
function e_(e, t, n) {
	if (t instanceof Om) return function(e, t, n) {
		return n.filter(((e) => e.isFoundDocument() && `/${e.key.getCollectionPath().canonicalString()}` === t.hr));
	}(0, t, n);
	if (t instanceof Mm) return function(e, t, n) {
		return n.filter(((n) => {
			let r = Gm($(t.condition).evaluate(e, n));
			return r !== void 0 && Pl(r, jl);
		}));
	}(e, t, n);
	if (t instanceof km) return function(e, t, n) {
		return n.filter(((e) => e.isFoundDocument() && e.key.getCollectionPath().lastSegment() === t.collectionId));
	}(0, t, n);
	if (t instanceof Am) return function(e, t, n) {
		return n.filter(((e) => e.isFoundDocument()));
	}(0, 0, n);
	if (t instanceof jm) return function(e, t, n) {
		return n.filter(((e) => e.isFoundDocument() && t.Pr.has(e.key.path.toStringWithLeadingSlash())));
	}(0, t, n);
	if (t instanceof Nm) return function(e, t, n) {
		return n.slice(0, t.limit);
	}(0, t, n);
	if (t instanceof Im) return function(e, t, n) {
		let r = t.orderings.map(((e) => ({
			Ms: $(e.expr),
			direction: e.direction
		})));
		return [...n].sort(((t, n) => {
			for (let { Ms: i, direction: a } of r) {
				let r = Gm(i.evaluate(e, t)), o = Gm(i.evaluate(e, n)), s = Il(r ?? Al, o ?? Al);
				if (s !== 0) return a === "ascending" ? s : -s;
			}
			return 0;
		}));
	}(e, t, n);
	throw Error(`Unknown stage: ${t._name}`);
}
function t_(e) {
	let t = function(e) {
		for (let t = e.stages.length - 1; t >= 0; t--) {
			let n = e.stages[t];
			if (n instanceof Im) return n.orderings;
		}
		throw Error("Pipeline must contain at least one Sort stage");
	}(e);
	return (n, r) => {
		for (let i of t) {
			let t = Gm($(i.expr).evaluate({ serializer: e.serializer }, n)), a = Gm($(i.expr).evaluate({ serializer: e.serializer }, r)), o = Il(t || Al, a || Al);
			if (o !== 0) return i.direction === "ascending" ? o : -o;
		}
		return 0;
	};
}
var n_ = class {
	constructor() {
		this.changes = new Fd(((e) => e.toString()), ((e, t) => e.isEqual(t))), this.changesApplied = !1;
	}
	addEntry(e) {
		this.assertNotApplied(), this.changes.set(e.key, e);
	}
	removeEntry(e, t) {
		this.assertNotApplied(), this.changes.set(e, od.newInvalidDocument(e).setReadTime(t));
	}
	getEntry(e, t) {
		this.assertNotApplied();
		let n = this.changes.get(t);
		return n === void 0 ? this.getFromCache(e, t) : Y.resolve(n);
	}
	getEntries(e, t) {
		return this.getAllFromCache(e, t);
	}
	apply(e) {
		return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(e);
	}
	assertNotApplied() {}
}, r_ = class {
	constructor(e, t) {
		this.overlayedDocument = e, this.mutatedFields = t;
	}
}, i_ = class {
	constructor(e, t, n, r) {
		this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = n, this.indexManager = r;
	}
	getDocument(e, t) {
		let n = null;
		return this.documentOverlayCache.getOverlay(e, t).next(((r) => (n = r, this.remoteDocumentCache.getEntry(e, t)))).next(((e) => (n !== null && Ou(n.mutation, e, Uc.empty(), G.now()), e)));
	}
	getDocuments(e, t) {
		return this.remoteDocumentCache.getEntries(e, t).next(((t) => this.getLocalViewOfDocuments(e, t, Kd()).next((() => t))));
	}
	getLocalViewOfDocuments(e, t, n = Kd()) {
		let r = Vd();
		return this.populateOverlays(e, r, t).next((() => this.computeViews(e, t, r, n).next(((e) => {
			let t = zd();
			return e.forEach(((e, n) => {
				t = t.insert(e, n.overlayedDocument);
			})), t;
		}))));
	}
	getOverlayedDocuments(e, t) {
		let n = Vd();
		return this.populateOverlays(e, n, t).next((() => this.computeViews(e, t, n, Kd())));
	}
	populateOverlays(e, t, n) {
		let r = [];
		return n.forEach(((e) => {
			t.has(e) || r.push(e);
		})), this.documentOverlayCache.getOverlays(e, r).next(((e) => {
			e.forEach(((e, n) => {
				t.set(e, n);
			}));
		}));
	}
	computeViews(e, t, n, r) {
		let i = Ld(), a = Ud(), o = function() {
			return Ud();
		}();
		return t.forEach(((e, t) => {
			let o = n.get(t.key);
			r.has(t.key) && (o === void 0 || o.mutation instanceof Mu) ? i = i.insert(t.key, t) : o === void 0 ? a.set(t.key, Uc.empty()) : (a.set(t.key, o.mutation.getFieldMask()), Ou(o.mutation, t, o.mutation.getFieldMask(), G.now()));
		})), this.recalculateAndSaveOverlays(e, i).next(((e) => (e.forEach(((e, t) => a.set(e, t))), t.forEach(((e, t) => o.set(e, new r_(t, a.get(e) ?? null)))), o)));
	}
	recalculateAndSaveOverlays(e, t) {
		let n = Ud(), r = new Pc(((e, t) => e - t)), i = Kd();
		return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next(((e) => {
			for (let i of e) i.keys().forEach(((e) => {
				let a = t.get(e);
				if (a === null) return;
				let o = n.get(e) || Uc.empty();
				o = i.applyToLocalView(a, o), n.set(e, o);
				let s = (r.get(i.batchId) || Kd()).add(e);
				r = r.insert(i.batchId, s);
			}));
		})).next((() => {
			let a = [], o = r.getReverseIterator();
			for (; o.hasNext();) {
				let r = o.getNext(), s = r.key, c = r.value, l = Hd();
				c.forEach(((e) => {
					if (!i.has(e)) {
						let r = Eu(t.get(e), n.get(e));
						r !== null && l.set(e, r), i = i.add(e);
					}
				})), a.push(this.documentOverlayCache.saveOverlays(e, s, l));
			}
			return Y.waitFor(a);
		})).next((() => n));
	}
	recalculateAndSaveOverlaysForDocumentKeys(e, t) {
		return this.remoteDocumentCache.getEntries(e, t).next(((t) => this.recalculateAndSaveOverlays(e, t)));
	}
	getDocumentsMatchingQuery(e, t, n, r) {
		return Ng(t) ? this.getDocumentsMatchingPipeline(e, t, n, r) : xd(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : Sd(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r) : this.getDocumentsMatchingCollectionQuery(e, t, n, r);
	}
	getNextDocuments(e, t, n, r) {
		return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, n, r).next(((i) => {
			let a = r - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, n.largestBatchId, r - i.size) : Y.resolve(Vd()), o = sd, s = i;
			return a.next(((t) => Y.forEach(t, ((t, n) => (o < n.largestBatchId && (o = n.largestBatchId), i.get(t) ? Y.resolve() : this.remoteDocumentCache.getEntry(e, t).next(((e) => {
				s = s.insert(t, e);
			}))))).next((() => this.populateOverlays(e, t, i))).next((() => this.computeViews(e, s, t, Kd()))).next(((e) => ({
				batchId: o,
				changes: Bd(e)
			})))));
		}));
	}
	getDocumentsMatchingDocumentQuery(e, t) {
		return this.getDocument(e, new U(t)).next(((e) => {
			let t = zd();
			return e.isFoundDocument() && (t = t.insert(e.key, e)), t;
		}));
	}
	getDocumentsMatchingCollectionGroupQuery(e, t, n, r) {
		let i = t.collectionGroup, a = zd();
		return this.indexManager.getCollectionParents(e, i).next(((o) => Y.forEach(o, ((o) => {
			let s = function(e, t) {
				return new _d(t, null, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
			}(t, o.child(i));
			return this.getDocumentsMatchingCollectionQuery(e, s, n, r).next(((e) => {
				e.forEach(((e, t) => {
					a = a.insert(e, t);
				}));
			}));
		})).next((() => a))));
	}
	getDocumentsMatchingCollectionQuery(e, t, n, r) {
		let i;
		return this.documentOverlayCache.getOverlaysForCollection(e, t.path, n.largestBatchId).next(((a) => (i = a, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r)))).next(((e) => this.retrieveMatchingLocalDocuments(i, e, ((e) => kd(t, e)))));
	}
	getDocumentsMatchingPipeline(e, t, n, r) {
		if (Bm(t) === "collection_group") {
			let i = Hm(t), a = zd();
			return this.indexManager.getCollectionParents(e, i).next(((o) => Y.forEach(o, ((o) => {
				let s = function(e, t) {
					let n = e.stages.map(((e) => e instanceof km ? new Om(t.canonicalString(), {}) : e));
					return new zm(e.serializer, n);
				}(t, o.child(i));
				return this.getDocumentsMatchingPipeline(e, s, n, r).next(((e) => {
					e.forEach(((e, t) => {
						a = a.insert(e, t);
					}));
				}));
			})).next((() => a))));
		}
		{
			let i;
			return this.getOverlaysForPipeline(e, t, n.largestBatchId).next(((a) => {
				switch (i = a, Bm(t)) {
					case "collection": return this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r);
					case "documents":
						let a = Kd();
						for (let e of Wm(t)) a = a.add(U.fromPath(e));
						return this.remoteDocumentCache.getEntries(e, a);
					case "database": return this.remoteDocumentCache.getAllEntries(e);
					default: throw new V("invalid-argument", `Invalid pipeline source to execute offline: ${jg(t)}`);
				}
			})).next(((e) => this.retrieveMatchingLocalDocuments(i, e, ((e) => $g(t, e)))));
		}
	}
	retrieveMatchingLocalDocuments(e, t, n) {
		e.forEach(((e, n) => {
			let r = n.getKey();
			t.get(r) === null && (t = t.insert(r, od.newInvalidDocument(r)));
		}));
		let r = zd();
		return t.forEach(((t, i) => {
			let a = e.get(t);
			a !== void 0 && Ou(a.mutation, i, Uc.empty(), G.now()), n(i) && (r = r.insert(t, i));
		})), r;
	}
	getOverlaysForPipeline(e, t, n) {
		switch (Bm(t)) {
			case "collection": return this.documentOverlayCache.getOverlaysForCollection(e, H.fromString(Vm(t)), n);
			case "collection_group": throw new V("invalid-argument", `Unexpected collection group pipeline: ${jg(t)}`);
			case "documents": return this.documentOverlayCache.getOverlays(e, Wm(t).map(((e) => U.fromPath(e))));
			case "database": return this.documentOverlayCache.getAllOverlays(e, n);
			default: throw new V("invalid-argument", `Failed to get overlays for pipeline: ${jg(t)}`);
		}
	}
}, a_ = class {
	constructor(e) {
		this.serializer = e, this.Qs = /* @__PURE__ */ new Map(), this.Ws = /* @__PURE__ */ new Map();
	}
	getBundleMetadata(e, t) {
		return Y.resolve(this.Qs.get(t));
	}
	saveBundleMetadata(e, t) {
		return this.Qs.set(t.id, function(e) {
			return {
				id: e.id,
				version: e.version,
				createTime: ef(e.createTime)
			};
		}(t)), Y.resolve();
	}
	getNamedQuery(e, t) {
		return Y.resolve(this.Ws.get(t));
	}
	saveNamedQuery(e, t) {
		return this.Ws.set(t.name, function(e) {
			return {
				name: e.name,
				query: qg(e.bundledQuery),
				readTime: ef(e.readTime)
			};
		}(t)), Y.resolve();
	}
}, o_ = class {
	constructor() {
		this.overlays = new Pc(U.comparator), this.Gs = /* @__PURE__ */ new Map();
	}
	getOverlay(e, t) {
		return Y.resolve(this.overlays.get(t));
	}
	getOverlays(e, t) {
		let n = Vd();
		return Y.forEach(t, ((t) => this.getOverlay(e, t).next(((e) => {
			e !== null && n.set(t, e);
		})))).next((() => n));
	}
	getAllOverlays(e, t) {
		let n = Vd();
		return this.overlays.forEach(((e, r) => {
			r.largestBatchId > t && n.set(e, r);
		})), Y.resolve(n);
	}
	saveOverlays(e, t, n) {
		return n.forEach(((n, r) => {
			this.Zr(e, t, r);
		})), Y.resolve();
	}
	removeOverlaysForBatchId(e, t, n) {
		let r = this.Gs.get(n);
		return r !== void 0 && (r.forEach(((e) => this.overlays = this.overlays.remove(e))), this.Gs.delete(n)), Y.resolve();
	}
	getOverlaysForCollection(e, t, n) {
		let r = Vd(), i = t.length + 1, a = new U(t.child("")), o = this.overlays.getIteratorFrom(a);
		for (; o.hasNext();) {
			let e = o.getNext().value, a = e.getKey();
			if (!t.isPrefixOf(a.path)) break;
			a.path.length === i && e.largestBatchId > n && r.set(e.getKey(), e);
		}
		return Y.resolve(r);
	}
	getOverlaysForCollectionGroup(e, t, n, r) {
		let i = new Pc(((e, t) => e - t)), a = this.overlays.getIterator();
		for (; a.hasNext();) {
			let e = a.getNext().value;
			if (e.getKey().getCollectionGroup() === t && e.largestBatchId > n) {
				let t = i.get(e.largestBatchId);
				t === null && (t = Vd(), i = i.insert(e.largestBatchId, t)), t.set(e.getKey(), e);
			}
		}
		let o = Vd(), s = i.getIterator();
		for (; s.hasNext() && (s.getNext().value.forEach(((e, t) => o.set(e, t))), !(o.size() >= r)););
		return Y.resolve(o);
	}
	Zr(e, t, n) {
		let r = this.overlays.get(n.key);
		if (r !== null) {
			let e = this.Gs.get(r.largestBatchId).delete(n.key);
			this.Gs.set(r.largestBatchId, e);
		}
		this.overlays = this.overlays.insert(n.key, new Gg(t, n));
		let i = this.Gs.get(t);
		i === void 0 && (i = Kd(), this.Gs.set(t, i)), this.Gs.set(t, i.add(n.key));
	}
}, s_ = class {
	constructor() {
		this.sessionToken = al.EMPTY_BYTE_STRING;
	}
	getSessionToken(e) {
		return Y.resolve(this.sessionToken);
	}
	setSessionToken(e, t) {
		return this.sessionToken = t, Y.resolve();
	}
}, c_ = class {
	constructor() {
		this.zs = new Lc(l_.js), this.Hs = new Lc(l_.Js);
	}
	isEmpty() {
		return this.zs.isEmpty();
	}
	addReference(e, t) {
		let n = new l_(e, t);
		this.zs = this.zs.add(n), this.Hs = this.Hs.add(n);
	}
	Ys(e, t) {
		e.forEach(((e) => this.addReference(e, t)));
	}
	removeReference(e, t) {
		this.Zs(new l_(e, t));
	}
	Xs(e, t) {
		e.forEach(((e) => this.removeReference(e, t)));
	}
	e_(e) {
		let t = new U(new H([])), n = new l_(t, e), r = new l_(t, e + 1), i = [];
		return this.Hs.forEachInRange([n, r], ((e) => {
			this.Zs(e), i.push(e.key);
		})), i;
	}
	t_() {
		this.zs.forEach(((e) => this.Zs(e)));
	}
	Zs(e) {
		this.zs = this.zs.delete(e), this.Hs = this.Hs.delete(e);
	}
	n_(e) {
		let t = new U(new H([])), n = new l_(t, e), r = new l_(t, e + 1), i = Kd();
		return this.Hs.forEachInRange([n, r], ((e) => {
			i = i.add(e.key);
		})), i;
	}
	containsKey(e) {
		let t = new l_(e, 0), n = this.zs.firstAfterOrEqual(t);
		return n !== null && e.isEqual(n.key);
	}
}, l_ = class {
	constructor(e, t) {
		this.key = e, this.r_ = t;
	}
	static js(e, t) {
		return U.comparator(e.key, t.key) || z(e.r_, t.r_);
	}
	static Js(e, t) {
		return z(e.r_, t.r_) || U.comparator(e.key, t.key);
	}
}, u_ = class {
	constructor(e, t) {
		this.indexManager = e, this.referenceDelegate = t, this.mutationQueue = [], this.Gr = 1, this.i_ = new Lc(l_.js);
	}
	checkEmpty(e) {
		return Y.resolve(this.mutationQueue.length === 0);
	}
	addMutationBatch(e, t, n, r) {
		let i = this.Gr;
		this.Gr++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
		let a = new zg(i, t, n, r);
		this.mutationQueue.push(a);
		for (let t of r) this.i_ = this.i_.add(new l_(t.key, i)), this.indexManager.addToCollectionParentIndex(e, t.key.path.popLast());
		return Y.resolve(a);
	}
	lookupMutationBatch(e, t) {
		return Y.resolve(this.s_(t));
	}
	getNextMutationBatchAfterBatchId(e, t) {
		let n = t + 1, r = this.__(n), i = r < 0 ? 0 : r;
		return Y.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
	}
	getHighestUnacknowledgedBatchId() {
		return Y.resolve(this.mutationQueue.length === 0 ? bl : this.Gr - 1);
	}
	getAllMutationBatches(e) {
		return Y.resolve(this.mutationQueue.slice());
	}
	getAllMutationBatchesAffectingDocumentKey(e, t) {
		let n = new l_(t, 0), r = new l_(t, Infinity), i = [];
		return this.i_.forEachInRange([n, r], ((e) => {
			let t = this.s_(e.r_);
			i.push(t);
		})), Y.resolve(i);
	}
	getAllMutationBatchesAffectingDocumentKeys(e, t) {
		let n = new Lc(z);
		return t.forEach(((e) => {
			let t = new l_(e, 0), r = new l_(e, Infinity);
			this.i_.forEachInRange([t, r], ((e) => {
				n = n.add(e.r_);
			}));
		})), Y.resolve(this.o_(n));
	}
	getAllMutationBatchesAffectingQuery(e, t) {
		let n = t.path, r = n.length + 1, i = n;
		U.isDocumentKey(i) || (i = i.child(""));
		let a = new l_(new U(i), 0), o = new Lc(z);
		return this.i_.forEachWhile(((e) => {
			let t = e.key.path;
			return !!n.isPrefixOf(t) && (t.length === r && (o = o.add(e.r_)), !0);
		}), a), Y.resolve(this.o_(o));
	}
	o_(e) {
		let t = [];
		return e.forEach(((e) => {
			let n = this.s_(e);
			n !== null && t.push(n);
		})), t;
	}
	removeMutationBatch(e, t) {
		L(this.a_(t.batchId, "removed") === 0, 55003), this.mutationQueue.shift();
		let n = this.i_;
		return Y.forEach(t.mutations, ((r) => {
			let i = new l_(r.key, t.batchId);
			return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, r.key);
		})).next((() => {
			this.i_ = n;
		}));
	}
	Hr(e) {}
	containsKey(e, t) {
		let n = new l_(t, 0), r = this.i_.firstAfterOrEqual(n);
		return Y.resolve(t.isEqual(r && r.key));
	}
	performConsistencyCheck(e) {
		return this.mutationQueue.length, Y.resolve();
	}
	a_(e, t) {
		return this.__(e);
	}
	__(e) {
		return this.mutationQueue.length === 0 ? 0 : e - this.mutationQueue[0].batchId;
	}
	s_(e) {
		let t = this.__(e);
		return t < 0 || t >= this.mutationQueue.length ? null : this.mutationQueue[t];
	}
}, d_ = class {
	constructor(e) {
		this.u_ = e, this.docs = function() {
			return new Pc(U.comparator);
		}(), this.size = 0;
	}
	setIndexManager(e) {
		this.indexManager = e;
	}
	addEntry(e, t) {
		let n = t.key, r = this.docs.get(n), i = r ? r.size : 0, a = this.u_(t);
		return this.docs = this.docs.insert(n, {
			document: t.mutableCopy(),
			size: a
		}), this.size += a - i, this.indexManager.addToCollectionParentIndex(e, n.path.popLast());
	}
	removeEntry(e) {
		let t = this.docs.get(e);
		t && (this.docs = this.docs.remove(e), this.size -= t.size);
	}
	getEntry(e, t) {
		let n = this.docs.get(t);
		return Y.resolve(n ? n.document.mutableCopy() : od.newInvalidDocument(t));
	}
	getEntries(e, t) {
		let n = Ld();
		return t.forEach(((e) => {
			let t = this.docs.get(e);
			n = n.insert(e, t ? t.document.mutableCopy() : od.newInvalidDocument(e));
		})), Y.resolve(n);
	}
	getAllEntries(e) {
		let t = Ld();
		return this.docs.forEach(((e, n) => {
			t = t.insert(e, n.document);
		})), Y.resolve(t);
	}
	getDocumentsMatchingQuery(e, t, n, r) {
		let i, a;
		Ng(t) ? (i = H.fromString(Vm(t)), a = (e) => $g(t, e)) : (i = t.path, a = (e) => kd(t, e));
		let o = Ld(), s = new U(i.child("__id-9223372036854775808__")), c = this.docs.getIteratorFrom(s);
		for (; c.hasNext();) {
			let { key: e, value: { document: t } } = c.getNext();
			if (!i.isPrefixOf(e.path)) break;
			e.path.length > i.length + 1 || dd(ld(t), n) <= 0 || (r.has(t.key) || a(t)) && (o = o.insert(t.key, t.mutableCopy()));
		}
		return Y.resolve(o);
	}
	getAllFromCollectionGroup(e, t, n, r) {
		I(9500);
	}
	c_(e, t) {
		return Y.forEach(this.docs, ((e) => t(e)));
	}
	newChangeBuffer(e) {
		return new f_(this);
	}
	getSize(e) {
		return Y.resolve(this.size);
	}
}, f_ = class extends n_ {
	constructor(e) {
		super(), this.$s = e;
	}
	applyChanges(e) {
		let t = [];
		return this.changes.forEach(((n, r) => {
			r.isValidDocument() ? t.push(this.$s.addEntry(e, r)) : this.$s.removeEntry(n);
		})), Y.waitFor(t);
	}
	getFromCache(e, t) {
		return this.$s.getEntry(e, t);
	}
	getAllFromCache(e, t) {
		return this.$s.getEntries(e, t);
	}
}, p_ = class {
	constructor(e) {
		this.persistence = e, this.l_ = new Fd(((e) => Lg(e)), Rg), this.lastRemoteSnapshotVersion = q.min(), this.highestTargetId = 0, this.E_ = 0, this.h_ = new c_(), this.targetCount = 0, this.T_ = Zg.ws();
	}
	forEachTarget(e, t) {
		return this.l_.forEach(((e, n) => t(n))), Y.resolve();
	}
	getLastRemoteSnapshotVersion(e) {
		return Y.resolve(this.lastRemoteSnapshotVersion);
	}
	getHighestSequenceNumber(e) {
		return Y.resolve(this.E_);
	}
	allocateTargetId(e) {
		return this.highestTargetId = this.T_.next(), Y.resolve(this.highestTargetId);
	}
	setTargetsMetadata(e, t, n) {
		return n && (this.lastRemoteSnapshotVersion = n), t > this.E_ && (this.E_ = t), Y.resolve();
	}
	Ds(e) {
		this.l_.set(e.target, e);
		let t = e.targetId;
		t > this.highestTargetId && (this.T_ = new Zg(t), this.highestTargetId = t), e.sequenceNumber > this.E_ && (this.E_ = e.sequenceNumber);
	}
	addTargetData(e, t) {
		return this.Ds(t), this.targetCount += 1, Y.resolve();
	}
	updateTargetData(e, t) {
		return this.Ds(t), Y.resolve();
	}
	removeTargetData(e, t) {
		return this.l_.delete(t.target), this.h_.e_(t.targetId), --this.targetCount, Y.resolve();
	}
	removeTargets(e, t, n) {
		let r = 0, i = [];
		return this.l_.forEach(((a, o) => {
			o.sequenceNumber <= t && n.get(o.targetId) === null && (this.l_.delete(a), i.push(this.removeMatchingKeysForTargetId(e, o.targetId)), r++);
		})), Y.waitFor(i).next((() => r));
	}
	getTargetCount(e) {
		return Y.resolve(this.targetCount);
	}
	getTargetData(e, t) {
		let n = this.l_.get(t) || null;
		return Y.resolve(n);
	}
	addMatchingKeys(e, t, n) {
		return this.h_.Ys(t, n), Y.resolve();
	}
	removeMatchingKeys(e, t, n) {
		this.h_.Xs(t, n);
		let r = this.persistence.referenceDelegate, i = [];
		return r && t.forEach(((t) => {
			i.push(r.markPotentiallyOrphaned(e, t));
		})), Y.waitFor(i);
	}
	removeMatchingKeysForTargetId(e, t) {
		return this.h_.e_(t), Y.resolve();
	}
	getMatchingKeysForTargetId(e, t) {
		let n = this.h_.n_(t);
		return Y.resolve(n);
	}
	containsKey(e, t) {
		return Y.resolve(this.h_.containsKey(t));
	}
}, m_ = class {
	constructor(e, t) {
		this.P_ = {}, this.overlays = {}, this.I_ = new lp(0), this.R_ = !1, this.R_ = !0, this.A_ = new s_(), this.referenceDelegate = e(this), this.V_ = new p_(this), this.indexManager = new Yg(), this.remoteDocumentCache = function(e) {
			return new d_(e);
		}(((e) => this.referenceDelegate.d_(e))), this.serializer = new Kg(t), this.f_ = new a_(this.serializer);
	}
	start() {
		return Promise.resolve();
	}
	shutdown() {
		return this.R_ = !1, Promise.resolve();
	}
	get started() {
		return this.R_;
	}
	setDatabaseDeletedListener() {}
	setNetworkEnabled() {}
	getIndexManager(e) {
		return this.indexManager;
	}
	getDocumentOverlayCache(e) {
		let t = this.overlays[e.toKey()];
		return t || (t = new o_(), this.overlays[e.toKey()] = t), t;
	}
	getMutationQueue(e, t) {
		let n = this.P_[e.toKey()];
		return n || (n = new u_(t, this.referenceDelegate), this.P_[e.toKey()] = n), n;
	}
	getGlobalsCache() {
		return this.A_;
	}
	getTargetCache() {
		return this.V_;
	}
	getRemoteDocumentCache() {
		return this.remoteDocumentCache;
	}
	getBundleCache() {
		return this.f_;
	}
	runTransaction(e, t, n) {
		F("MemoryPersistence", "Starting transaction:", e);
		let r = new h_(this.I_.next());
		return this.referenceDelegate.m_(), n(r).next(((e) => this.referenceDelegate.p_(r).next((() => e)))).toPromise().then(((e) => (r.raiseOnCommittedEvent(), e)));
	}
	g_(e, t) {
		return Y.or(Object.values(this.P_).map(((n) => () => n.containsKey(e, t))));
	}
}, h_ = class extends dp {
	constructor(e) {
		super(), this.currentSequenceNumber = e;
	}
}, g_ = class e {
	constructor(e) {
		this.persistence = e, this.y_ = new c_(), this.w_ = null;
	}
	static b_(t) {
		return new e(t);
	}
	get S_() {
		if (this.w_) return this.w_;
		throw I(60996);
	}
	addReference(e, t, n) {
		return this.y_.addReference(n, t), this.S_.delete(n.toString()), Y.resolve();
	}
	removeReference(e, t, n) {
		return this.y_.removeReference(n, t), this.S_.add(n.toString()), Y.resolve();
	}
	markPotentiallyOrphaned(e, t) {
		return this.S_.add(t.toString()), Y.resolve();
	}
	removeTarget(e, t) {
		this.y_.e_(t.targetId).forEach(((e) => this.S_.add(e.toString())));
		let n = this.persistence.getTargetCache();
		return n.getMatchingKeysForTargetId(e, t.targetId).next(((e) => {
			e.forEach(((e) => this.S_.add(e.toString())));
		})).next((() => n.removeTargetData(e, t)));
	}
	m_() {
		this.w_ = /* @__PURE__ */ new Set();
	}
	p_(e) {
		let t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
		return Y.forEach(this.S_, ((n) => {
			let r = U.fromPath(n);
			return this.v_(e, r).next(((e) => {
				e || t.removeEntry(r, q.min());
			}));
		})).next((() => (this.w_ = null, t.apply(e))));
	}
	updateLimboDocument(e, t) {
		return this.v_(e, t).next(((e) => {
			e ? this.S_.delete(t.toString()) : this.S_.add(t.toString());
		}));
	}
	d_(e) {
		return 0;
	}
	v_(e, t) {
		return Y.or([
			() => Y.resolve(this.y_.containsKey(t)),
			() => this.persistence.getTargetCache().containsKey(e, t),
			() => this.persistence.g_(e, t)
		]);
	}
}, __ = class e {
	constructor(e, t) {
		this.persistence = e, this.D_ = new Fd(((e) => Hg(e.path)), ((e, t) => e.isEqual(t))), this.garbageCollector = xp(this, t);
	}
	static b_(t, n) {
		return new e(t, n);
	}
	m_() {}
	p_(e) {
		return Y.resolve();
	}
	forEachTarget(e, t) {
		return this.persistence.getTargetCache().forEachTarget(e, t);
	}
	ir(e) {
		let t = this.Cs(e);
		return this.persistence.getTargetCache().getTargetCount(e).next(((e) => t.next(((t) => e + t))));
	}
	Cs(e) {
		let t = 0;
		return this.sr(e, ((e) => {
			t++;
		})).next((() => t));
	}
	sr(e, t) {
		return Y.forEach(this.D_, ((n, r) => this.Os(e, n, r).next(((e) => e ? Y.resolve() : t(r)))));
	}
	removeTargets(e, t, n) {
		return this.persistence.getTargetCache().removeTargets(e, t, n);
	}
	removeOrphanedDocuments(e, t) {
		let n = 0, r = this.persistence.getRemoteDocumentCache(), i = r.newChangeBuffer();
		return r.c_(e, ((r) => this.Os(e, r, t).next(((e) => {
			e || (n++, i.removeEntry(r, q.min()));
		})))).next((() => i.apply(e))).next((() => n));
	}
	markPotentiallyOrphaned(e, t) {
		return this.D_.set(t, e.currentSequenceNumber), Y.resolve();
	}
	removeTarget(e, t) {
		let n = t.withSequenceNumber(e.currentSequenceNumber);
		return this.persistence.getTargetCache().updateTargetData(e, n);
	}
	addReference(e, t, n) {
		return this.D_.set(n, e.currentSequenceNumber), Y.resolve();
	}
	removeReference(e, t, n) {
		return this.D_.set(n, e.currentSequenceNumber), Y.resolve();
	}
	updateLimboDocument(e, t) {
		return this.D_.set(t, e.currentSequenceNumber), Y.resolve();
	}
	d_(e) {
		let t = e.key.toString().length;
		return e.isFoundDocument() && (t += Vl(e.data.value)), t;
	}
	Os(e, t, n) {
		return Y.or([
			() => this.persistence.g_(e, t),
			() => this.persistence.getTargetCache().containsKey(e, t),
			() => {
				let e = this.D_.get(t);
				return Y.resolve(e !== void 0 && e > n);
			}
		]);
	}
	getCacheSize(e) {
		return this.persistence.getRemoteDocumentCache().getSize(e);
	}
}, v_ = class e {
	constructor(e, t, n, r) {
		this.targetId = e, this.fromCache = t, this.Vo = n, this.fo = r;
	}
	static mo(t, n) {
		let r = Kd(), i = Kd();
		for (let e of n.docChanges) switch (e.type) {
			case 0:
				r = r.add(e.doc.key);
				break;
			case 1: i = i.add(e.doc.key);
		}
		return new e(t, n.fromCache, r, i);
	}
};
function y_(e, t) {
	return U.comparator(e.key, t.key);
}
var b_ = class {
	constructor() {
		this._documentReadCount = 0;
	}
	get documentReadCount() {
		return this._documentReadCount;
	}
	incrementDocumentReadCount(e) {
		this._documentReadCount += e;
	}
}, x_ = class {
	constructor() {
		this.po = !1, this.yo = !1, this.wo = 100, this.bo = function() {
			return se() ? 8 : pp(v()) > 0 ? 6 : 4;
		}();
	}
	initialize(e, t) {
		this.So = e, this.indexManager = t, this.po = !0;
	}
	getDocumentsMatchingQuery(e, t, n, r) {
		let i = { result: null };
		return this.vo(e, t).next(((e) => {
			i.result = e;
		})).next((() => {
			if (!i.result) return this.Do(e, t, r, n).next(((e) => {
				i.result = e;
			}));
		})).next((() => {
			if (i.result) return;
			let n = new b_();
			return this.xo(e, t, n).next(((r) => {
				if (i.result = r, this.yo) return this.Co(e, t, n, r.size);
			}));
		})).next((() => i.result));
	}
	Co(e, t, n, r) {
		return Ng(t) ? Y.resolve() : n.documentReadCount < this.wo ? (Sc() <= y.DEBUG && F("QueryEngine", "SDK will not create cache indexes for query:", Od(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.wo, "documents"), Y.resolve()) : (Sc() <= y.DEBUG && F("QueryEngine", "Query:", Od(t), "scans", n.documentReadCount, "local documents and returns", r, "documents as results."), n.documentReadCount > this.bo * r ? (Sc() <= y.DEBUG && F("QueryEngine", "The SDK decides to create cache indexes for query:", Od(t), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, wd(t))) : Y.resolve());
	}
	vo(e, t) {
		if (Ng(t)) return Y.resolve(null);
		let n = t;
		if (bd(n)) return Y.resolve(null);
		let r = wd(n);
		return this.indexManager.getIndexType(e, r).next(((t) => t === 0 ? null : (n.limit !== null && t === 1 && (n = Ed(n, null, "F"), r = wd(n)), this.indexManager.getDocumentsMatchingTarget(e, r).next(((t) => {
			let i = Kd(...t);
			return this.So.getDocuments(e, i).next(((t) => this.indexManager.getMinOffset(e, r).next(((r) => {
				let a = this.Fo(n, t);
				return this.Oo(n, a, i, r.readTime) ? this.vo(e, Ed(n, null, "F")) : this.Mo(e, a, n, r);
			}))));
		})))));
	}
	Do(e, t, n, r) {
		return (Ng(t) ? function(e) {
			for (let t of e.stages) {
				if (t instanceof Nm || t instanceof Pm) return !1;
				if (t instanceof Mm) {
					if (t.condition instanceof gm && t.condition._expr.name === "exists" && t.condition._expr.params[0] instanceof lm && t.condition._expr.params[0].fieldName === zc) continue;
					return !1;
				}
			}
			return !0;
		}(t) : bd(t)) || r.isEqual(q.min()) ? Y.resolve(null) : this.So.getDocuments(e, n).next(((i) => {
			let a = this.Fo(t, i);
			return this.Oo(t, a, n, r) ? Y.resolve(null) : (Sc() <= y.DEBUG && F("QueryEngine", "Re-using previous result from %s to execute query: %s", r.toString(), Pg(t)), this.Mo(e, a, t, cd(r, sd)).next(((e) => e)));
		}));
	}
	Fo(e, t) {
		let n, r;
		return Ng(e) ? (n = new Lc(y_), r = (t) => $g(e, t)) : (n = new Lc(Ad(e)), r = (t) => kd(e, t)), t.forEach(((e, t) => {
			r(t) && (n = n.add(t));
		})), n;
	}
	Oo(e, t, n, r) {
		if (Ng(e)) return function(e) {
			return e.stages.some(((e) => e instanceof Nm || e instanceof Pm));
		}(e);
		if (e.limit === null) return !1;
		if (n.size !== t.size) return !0;
		let i = e.limitType === "F" ? t.last() : t.first();
		return !!i && (i.hasPendingWrites || i.version.compareTo(r) > 0);
	}
	xo(e, t, n) {
		return Sc() <= y.DEBUG && F("QueryEngine", "Using full collection scan to execute query:", Pg(t)), this.So.getDocumentsMatchingQuery(e, t, ud.min(), n);
	}
	Mo(e, t, n, r) {
		return this.So.getDocumentsMatchingQuery(e, n, r).next(((e) => (t.forEach(((t) => {
			e = e.insert(t.key, t);
		})), e)));
	}
}, S_ = "LocalStore", C_ = class {
	constructor(e, t, n, r) {
		this.persistence = e, this.No = t, this.serializer = r, this.Lo = new Pc(z), this.Bo = new Fd(((e) => Lg(e)), Rg), this.Uo = /* @__PURE__ */ new Map(), this.ko = e.getRemoteDocumentCache(), this.V_ = e.getTargetCache(), this.f_ = e.getBundleCache(), this.qo(n);
	}
	qo(e) {
		this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new i_(this.ko, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.ko.setIndexManager(this.indexManager), this.No.initialize(this.localDocuments, this.indexManager);
	}
	collectGarbage(e) {
		return this.persistence.runTransaction("Collect garbage", "readwrite-primary", ((t) => e.collect(t, this.Lo)));
	}
};
function w_(e, t, n, r) {
	return new C_(e, t, n, r);
}
async function T_(e, t) {
	let n = R(e);
	return await n.persistence.runTransaction("Handle user change", "readonly", ((e) => {
		let r;
		return n.mutationQueue.getAllMutationBatches(e).next(((i) => (r = i, n.qo(t), n.mutationQueue.getAllMutationBatches(e)))).next(((t) => {
			let i = [], a = [], o = Kd();
			for (let e of r) {
				i.push(e.batchId);
				for (let t of e.mutations) o = o.add(t.key);
			}
			for (let e of t) {
				a.push(e.batchId);
				for (let t of e.mutations) o = o.add(t.key);
			}
			return n.localDocuments.getDocuments(e, o).next(((e) => ({
				$o: e,
				removedBatchIds: i,
				addedBatchIds: a
			})));
		}));
	}));
}
function E_(e, t) {
	let n = R(e);
	return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", ((e) => {
		let r = t.batch.keys(), i = n.ko.newChangeBuffer({ trackRemovals: !0 });
		return function(e, t, n, r) {
			let i = n.batch, a = i.keys(), o = Y.resolve();
			return a.forEach(((e) => {
				o = o.next((() => r.getEntry(t, e))).next(((t) => {
					let a = n.docVersions.get(e);
					L(a !== null, 48541), t.version.compareTo(a) < 0 && (i.applyToRemoteDocument(t, n), t.isValidDocument() && (t.setReadTime(n.commitVersion), r.addEntry(t)));
				}));
			})), o.next((() => e.mutationQueue.removeMutationBatch(t, i)));
		}(n, e, t, i).next((() => i.apply(e))).next((() => n.mutationQueue.performConsistencyCheck(e))).next((() => n.documentOverlayCache.removeOverlaysForBatchId(e, r, t.batch.batchId))).next((() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e, function(e) {
			let t = Kd();
			for (let n = 0; n < e.mutationResults.length; ++n) e.mutationResults[n].transformResults.length > 0 && (t = t.add(e.batch.mutations[n].key));
			return t;
		}(t)))).next((() => n.localDocuments.getDocuments(e, r)));
	}));
}
function D_(e) {
	let t = R(e);
	return t.persistence.runTransaction("Get last remote snapshot version", "readonly", ((e) => t.V_.getLastRemoteSnapshotVersion(e)));
}
function O_(e, t) {
	let n = R(e);
	return n.persistence.runTransaction("Get next mutation batch", "readonly", ((e) => (t === void 0 && (t = bl), n.mutationQueue.getNextMutationBatchAfterBatchId(e, t))));
}
var k_ = class {
	constructor(e, t) {
		this.asyncQueue = e, this.onlineStateHandler = t, this.state = "Unknown", this.Yo = 0, this.Zo = null, this.Xo = !0;
	}
	ea() {
		this.Yo === 0 && (this.ta("Unknown"), this.Zo = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, (() => (this.Zo = null, this.na("Backend didn't respond within 10 seconds."), this.ta("Offline"), Promise.resolve()))));
	}
	ra(e) {
		this.state === "Online" ? this.ta("Unknown") : (this.Yo++, this.Yo >= 1 && (this.ia(), this.na(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.ta("Offline")));
	}
	set(e) {
		this.ia(), this.Yo = 0, e === "Online" && (this.Xo = !1), this.ta(e);
	}
	ta(e) {
		e !== this.state && (this.state = e, this.onlineStateHandler(e));
	}
	na(e) {
		let t = `Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
		this.Xo ? (Cc(t), this.Xo = !1) : F("OnlineStateTracker", t);
	}
	ia() {
		this.Zo !== null && (this.Zo.cancel(), this.Zo = null);
	}
}, A_ = "RemoteStore", j_ = class {
	constructor(e, t, n, r, i) {
		this.localStore = e, this.datastore = t, this.asyncQueue = n, this.remoteSyncer = {}, this.sa = [], this._a = /* @__PURE__ */ new Map(), this.oa = /* @__PURE__ */ new Map(), this.aa = /* @__PURE__ */ new Map(), this.ua = new Zg(1e3), this.ca = new Zg(1001), this.la = /* @__PURE__ */ new Set(), this.Ea = [], this.ha = i, this.ha.Qe(((e) => {
			n.enqueueAndForget((async () => {
				P_(this) && (F(A_, "Restarting streams for network reachability change."), await async function(e) {
					let t = R(e);
					t.la.add(4), await N_(t), t.Ta.set("Unknown"), t.la.delete(4), await M_(t);
				}(this));
			}));
		})), this.Ta = new k_(n, r);
	}
};
async function M_(e) {
	if (P_(e)) for (let t of e.Ea) await t(!0);
}
async function N_(e) {
	for (let t of e.Ea) await t(!1);
}
function P_(e) {
	return R(e).la.size === 0;
}
async function F_(e, t, n) {
	if (!mp(t)) throw t;
	e.la.add(1), await N_(e), e.Ta.set("Offline"), n ||= () => D_(e.localStore), e.asyncQueue.enqueueRetryable((async () => {
		F(A_, "Retrying IndexedDB access"), await n(), e.la.delete(1), await M_(e);
	}));
}
function I_(e, t) {
	return t().catch(((n) => F_(e, n, t)));
}
async function L_(e) {
	let t = R(e), n = J_(t), r = t.sa.length > 0 ? t.sa[t.sa.length - 1].batchId : bl;
	for (; R_(t);) try {
		let e = await O_(t.localStore, r);
		if (e === null) {
			t.sa.length === 0 && n.en();
			break;
		}
		r = e.batchId, z_(t, e);
	} catch (e) {
		await F_(t, e);
	}
	B_(t) && V_(t);
}
function R_(e) {
	return P_(e) && e.sa.length < 10;
}
function z_(e, t) {
	e.sa.push(t);
	let n = J_(e);
	n.Yt() && n.Rn && n.An(t.mutations);
}
function B_(e) {
	return P_(e) && !J_(e).Jt() && e.sa.length > 0;
}
function V_(e) {
	J_(e).start();
}
async function H_(e) {
	J_(e).fn();
}
async function U_(e) {
	let t = J_(e);
	for (let n of e.sa) t.An(n.mutations);
}
async function W_(e, t, n) {
	let r = e.sa.shift(), i = Bg.from(r, t, n);
	await I_(e, (() => e.remoteSyncer.applySuccessfulWrite(i))), await L_(e);
}
async function G_(e, t) {
	t && J_(e).Rn && await async function(e, t) {
		if (function(e) {
			return Nd(e) && e !== B.ABORTED;
		}(t.code)) {
			let n = e.sa.shift();
			J_(e).Xt(), await I_(e, (() => e.remoteSyncer.rejectFailedWrite(n.batchId, t))), await L_(e);
		}
	}(e, t), B_(e) && V_(e);
}
async function K_(e, t) {
	let n = R(e);
	n.asyncQueue.verifyOperationInProgress(), F(A_, "RemoteStore received new credentials");
	let r = P_(n);
	n.la.add(3), await N_(n), r && n.Ta.set("Unknown"), await n.remoteSyncer.handleCredentialChange(t), n.la.delete(3), await M_(n);
}
async function q_(e, t) {
	let n = R(e);
	t ? (n.la.delete(2), await M_(n)) : t || (n.la.add(2), await N_(n), n.Ta.set("Unknown"));
}
function J_(e) {
	return e.Ra || (e.Ra = function(e, t, n) {
		let r = R(e);
		return r.pn(), new $f(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
	}(e.datastore, e.asyncQueue, {
		ct: () => Promise.resolve(),
		Et: H_.bind(null, e),
		Tt: G_.bind(null, e),
		Vn: U_.bind(null, e),
		dn: W_.bind(null, e)
	}), e.Ea.push((async (t) => {
		t ? (e.Ra.Xt(), await L_(e)) : (await e.Ra.stop(), e.sa.length > 0 && (F(A_, `Stopping write stream with ${e.sa.length} pending writes`), e.sa = []));
	}))), e.Ra;
}
var Y_ = class e {
	constructor(e, t, n, r, i) {
		this.asyncQueue = e, this.timerId = t, this.targetTimeMs = n, this.op = r, this.removalCallback = i, this.deferred = new Df(), this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch(((e) => {}));
	}
	get promise() {
		return this.deferred.promise;
	}
	static createAndSchedule(t, n, r, i, a) {
		let o = Date.now() + r, s = new e(t, n, o, i, a);
		return s.start(r), s;
	}
	start(e) {
		this.timerHandle = setTimeout((() => this.handleDelayElapsed()), e);
	}
	skipDelay() {
		return this.handleDelayElapsed();
	}
	cancel(e) {
		this.timerHandle !== null && (this.clearTimeout(), this.deferred.reject(new V(B.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
	}
	handleDelayElapsed() {
		this.asyncQueue.enqueueAndForget((() => this.timerHandle === null ? Promise.resolve() : (this.clearTimeout(), this.op().then(((e) => this.deferred.resolve(e))))));
	}
	clearTimeout() {
		this.timerHandle !== null && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
	}
};
function X_(e, t) {
	if (Cc("AsyncQueue", `${t}: ${e}`), mp(e)) return new V(B.UNAVAILABLE, `${t}: ${e}`);
	throw e;
}
var Z_ = class {
	constructor() {
		this.activeTargetIds = Jd();
	}
	Ba(e) {
		this.activeTargetIds = this.activeTargetIds.add(e);
	}
	Ua(e) {
		this.activeTargetIds = this.activeTargetIds.delete(e);
	}
	La() {
		let e = {
			activeTargetIds: this.activeTargetIds.toArray(),
			updateTimeMs: Date.now()
		};
		return JSON.stringify(e);
	}
}, Q_ = class {
	constructor() {
		this.fu = new Z_(), this.mu = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
	}
	addPendingMutation(e) {}
	updateMutationState(e, t, n) {}
	addLocalQueryTarget(e, t = !0) {
		return t && this.fu.Ba(e), this.mu[e] || "not-current";
	}
	updateQueryState(e, t, n) {
		this.mu[e] = t;
	}
	removeLocalQueryTarget(e) {
		this.fu.Ua(e);
	}
	isLocalQueryTarget(e) {
		return this.fu.activeTargetIds.has(e);
	}
	clearQueryState(e) {
		delete this.mu[e];
	}
	getAllActiveQueryTargets() {
		return this.fu.activeTargetIds;
	}
	isActiveQueryTarget(e) {
		return this.fu.activeTargetIds.has(e);
	}
	start() {
		return this.fu = new Z_(), Promise.resolve();
	}
	handleUserChange(e, t, n) {}
	setOnlineState(e) {}
	shutdown() {}
	writeSequenceNumber(e) {}
	notifyBundleLoaded(e) {}
};
function $_() {
	return typeof document < "u" ? document : null;
}
var ev = class {
	constructor() {
		this.queries = tv(), this.onlineState = "Unknown", this.Du = /* @__PURE__ */ new Set();
	}
	terminate() {
		(function(e, t) {
			let n = R(e), r = n.queries;
			n.queries = tv(), r.forEach(((e, n) => {
				for (let e of n.bu) e.onError(t);
			}));
		})(this, new V(B.ABORTED, "Firestore shutting down"));
	}
};
function tv() {
	return new Fd(((e) => Fg(e)), Ig);
}
function nv(e) {
	e.Du.forEach(((e) => {
		e.next();
	}));
}
var rv;
(function(e) {
	e.Default = "default", e.Cache = "cache";
})(rv ||= {});
var iv = "SyncEngine", av = class {
	constructor(e, t, n, r, i, a) {
		this.localStore = e, this.remoteStore = t, this.eventManager = n, this.sharedClientState = r, this.currentUser = i, this.maxConcurrentLimboResolutions = a, this.hc = {}, this.Tc = new Fd(((e) => Fg(e)), Ig), this.Pc = /* @__PURE__ */ new Map(), this.Ic = /* @__PURE__ */ new Set(), this.Rc = new Pc(U.comparator), this.Ac = /* @__PURE__ */ new Map(), this.Vc = new c_(), this.dc = {}, this.fc = /* @__PURE__ */ new Map(), this.mc = Zg.bs(), this.onlineState = "Unknown", this.gc = void 0;
	}
	get isPrimaryClient() {
		return !0 === this.gc;
	}
};
async function ov(e, t, n) {
	let r = mv(e);
	try {
		let e = await function(e, t) {
			let n = R(e), r = G.now(), i = t.reduce(((e, t) => e.add(t.key)), Kd()), a, o;
			return n.persistence.runTransaction("Locally write mutations", "readwrite", ((e) => {
				let s = Ld(), c = Kd();
				return n.ko.getEntries(e, i).next(((e) => {
					s = e, s.forEach(((e, t) => {
						t.isValidDocument() || (c = c.add(e));
					}));
				})).next((() => n.localDocuments.getOverlayedDocuments(e, s))).next(((i) => {
					a = i;
					let o = [];
					for (let e of t) {
						let t = ku(e, a.get(e.key).overlayedDocument);
						t != null && o.push(new Mu(e.key, t, eu(t.value.mapValue), Cu.exists(!0)));
					}
					return n.mutationQueue.addMutationBatch(e, r, o, t);
				})).next(((t) => {
					o = t;
					let r = t.applyToLocalDocumentSet(a, c);
					return n.documentOverlayCache.saveOverlays(e, t.batchId, r);
				}));
			})).then((() => ({
				batchId: o.batchId,
				changes: Bd(a)
			})));
		}(r.localStore, t);
		r.sharedClientState.addPendingMutation(e.batchId), function(e, t, n) {
			let r = e.dc[e.currentUser.toKey()];
			r ||= new Pc(z), r = r.insert(t, n), e.dc[e.currentUser.toKey()] = r;
		}(r, e.batchId, n), await fv(r, e.changes), await L_(r.remoteStore);
	} catch (e) {
		let t = X_(e, "Failed to persist write");
		n.reject(t);
	}
}
function sv(e, t, n) {
	let r = R(e);
	if (r.isPrimaryClient && n === 0 || !r.isPrimaryClient && n === 1) {
		let e = [];
		r.Tc.forEach(((n, r) => {
			let i = r.view.xu(t);
			i.snapshot && e.push(i.snapshot);
		})), function(e, t) {
			let n = R(e);
			n.onlineState = t;
			let r = !1;
			n.queries.forEach(((e, n) => {
				for (let e of n.bu) e.xu(t) && (r = !0);
			})), r && nv(n);
		}(r.eventManager, t), e.length && r.hc.Tn(e), r.onlineState = t, r.isPrimaryClient && r.sharedClientState.setOnlineState(t);
	}
}
async function cv(e, t) {
	let n = R(e), r = t.batch.batchId;
	try {
		let e = await E_(n.localStore, t);
		dv(n, r, null), uv(n, r), n.sharedClientState.updateMutationState(r, "acknowledged"), await fv(n, e);
	} catch (e) {
		await fp(e);
	}
}
async function lv(e, t, n) {
	let r = R(e);
	try {
		let e = await function(e, t) {
			let n = R(e);
			return n.persistence.runTransaction("Reject batch", "readwrite-primary", ((e) => {
				let r;
				return n.mutationQueue.lookupMutationBatch(e, t).next(((t) => (L(t !== null, 37113), r = t.keys(), n.mutationQueue.removeMutationBatch(e, t)))).next((() => n.mutationQueue.performConsistencyCheck(e))).next((() => n.documentOverlayCache.removeOverlaysForBatchId(e, r, t))).next((() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e, r))).next((() => n.localDocuments.getDocuments(e, r)));
			}));
		}(r.localStore, t);
		dv(r, t, n), uv(r, t), r.sharedClientState.updateMutationState(t, "rejected", n), await fv(r, e);
	} catch (e) {
		await fp(e);
	}
}
function uv(e, t) {
	(e.fc.get(t) || []).forEach(((e) => {
		e.resolve();
	})), e.fc.delete(t);
}
function dv(e, t, n) {
	let r = R(e), i = r.dc[r.currentUser.toKey()];
	if (i) {
		let e = i.get(t);
		e && (n ? e.reject(n) : e.resolve(), i = i.remove(t)), r.dc[r.currentUser.toKey()] = i;
	}
}
async function fv(e, t, n) {
	let r = R(e), i = [], a = [], o = [];
	r.Tc.isEmpty() || (r.Tc.forEach(((e, s) => {
		o.push(r.yc(s, t, n).then(((e) => {
			if ((e || n) && r.isPrimaryClient) {
				let t = e ? !e.fromCache : n?.targetChanges.get(s.targetId)?.current;
				r.sharedClientState.updateQueryState(s.targetId, t ? "current" : "not-current");
			}
			if (e) {
				i.push(e);
				let t = v_.mo(s.targetId, e);
				a.push(t);
			}
		})));
	})), await Promise.all(o), r.hc.Tn(i), await async function(e, t) {
		let n = R(e);
		try {
			await n.persistence.runTransaction("notifyLocalViewChanges", "readwrite", ((e) => Y.forEach(t, ((t) => Y.forEach(t.Vo, ((r) => n.persistence.referenceDelegate.addReference(e, t.targetId, r))).next((() => Y.forEach(t.fo, ((r) => n.persistence.referenceDelegate.removeReference(e, t.targetId, r)))))))));
		} catch (e) {
			if (!mp(e)) throw e;
			F(S_, "Failed to update sequence numbers: " + e);
		}
		for (let e of t) {
			let t = e.targetId;
			if (!e.fromCache) {
				let e = n.Lo.get(t), r = e.snapshotVersion, i = e.withLastLimboFreeSnapshotVersion(r);
				n.Lo = n.Lo.insert(t, i);
			}
		}
	}(r.localStore, a));
}
async function pv(e, t) {
	let n = R(e);
	if (!n.currentUser.isEqual(t)) {
		F(iv, "User change. New user:", t.toKey());
		let e = await T_(n.localStore, t);
		n.currentUser = t, function(e, t) {
			e.fc.forEach(((e) => {
				e.forEach(((e) => {
					e.reject(new V(B.CANCELLED, t));
				}));
			})), e.fc.clear();
		}(n, "'waitForPendingWrites' promise is rejected due to a user change."), n.sharedClientState.handleUserChange(t, e.removedBatchIds, e.addedBatchIds), await fv(n, e.$o);
	}
}
function mv(e) {
	let t = R(e);
	return t.remoteStore.remoteSyncer.applySuccessfulWrite = cv.bind(null, t), t.remoteStore.remoteSyncer.rejectFailedWrite = lv.bind(null, t), t;
}
var hv = class {
	constructor() {
		this.kind = "memory", this.synchronizeTabs = !1;
	}
	async initialize(e) {
		this.serializer = bf(e.databaseInfo.databaseId), this.sharedClientState = this.vc(e), this.persistence = this.Dc(e), await this.persistence.start(), this.localStore = this.xc(e), this.gcScheduler = this.Cc(e, this.localStore), this.indexBackfillerScheduler = this.Fc(e, this.localStore);
	}
	Cc(e, t) {
		return null;
	}
	Fc(e, t) {
		return null;
	}
	xc(e) {
		return w_(this.persistence, new x_(), e.initialUser, this.serializer);
	}
	Dc(e) {
		return new m_(g_.b_, this.serializer);
	}
	vc(e) {
		return new Q_();
	}
	async terminate() {
		this.gcScheduler?.stop(), this.indexBackfillerScheduler?.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
	}
};
hv.provider = { build: () => new hv() };
var gv = class extends hv {
	constructor(e) {
		super(), this.cacheSizeBytes = e;
	}
	Cc(e, t) {
		L(this.persistence.referenceDelegate instanceof __, 46915);
		let n = this.persistence.referenceDelegate.garbageCollector;
		return new yp(n, e.asyncQueue, t);
	}
	Dc(e) {
		let t = this.cacheSizeBytes === void 0 ? cp.DEFAULT : cp.withCacheSize(this.cacheSizeBytes);
		return new m_(((e) => __.b_(e, t)), this.serializer);
	}
}, _v = class {
	async initialize(e, t) {
		this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(t, !e.synchronizeTabs), this.sharedClientState.onlineStateHandler = (e) => sv(this.syncEngine, e, 1), this.remoteStore.remoteSyncer.handleCredentialChange = pv.bind(null, this.syncEngine), await q_(this.remoteStore, this.syncEngine.isPrimaryClient));
	}
	createEventManager(e) {
		return function() {
			return new ev();
		}();
	}
	createDatastore(e) {
		let t = bf(e.databaseInfo.databaseId), n = Yf(e.databaseInfo);
		return np(e.authCredentials, e.appCheckCredentials, n, t);
	}
	createRemoteStore(e) {
		return function(e, t, n, r, i) {
			return new j_(e, t, n, r, i);
		}(this.localStore, this.datastore, e.asyncQueue, ((e) => sv(this.syncEngine, e, 0)), function() {
			return zf.Ye() ? new zf() : new Lf();
		}());
	}
	createSyncEngine(e, t) {
		return function(e, t, n, r, i, a, o) {
			let s = new av(e, t, n, r, i, a);
			return o && (s.gc = !0), s;
		}(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
	}
	async terminate() {
		await async function(e) {
			let t = R(e);
			F(A_, "RemoteStore shutting down."), t.la.add(5), await N_(t), t.ha.shutdown(), t.Ta.set("Unknown");
		}(this.remoteStore), this.datastore?.terminate(), this.eventManager?.terminate();
	}
};
_v.provider = { build: () => new _v() };
var vv = "FirestoreClient", yv = class {
	constructor(e, t, n, r, i) {
		this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = n, this._databaseInfo = r, this.user = Ef.UNAUTHENTICATED, this.clientId = Oc.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this._uninitializedComponentsProvider = i, this.authCredentials.start(n, (async (e) => {
			F(vv, "Received user=", e.uid), await this.authCredentialListener(e), this.user = e;
		})), this.appCheckCredentials.start(n, ((e) => (F(vv, "Received new app check token=", e), this.appCheckCredentialListener(e, this.user))));
	}
	get configuration() {
		return {
			asyncQueue: this.asyncQueue,
			databaseInfo: this._databaseInfo,
			clientId: this.clientId,
			authCredentials: this.authCredentials,
			appCheckCredentials: this.appCheckCredentials,
			initialUser: this.user,
			maxConcurrentLimboResolutions: 100
		};
	}
	setCredentialChangeListener(e) {
		this.authCredentialListener = e;
	}
	setAppCheckTokenChangeListener(e) {
		this.appCheckCredentialListener = e;
	}
	terminate() {
		this.asyncQueue.enterRestrictedMode();
		let e = new Df();
		return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async () => {
			try {
				this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
			} catch (t) {
				let n = X_(t, "Failed to shutdown persistence");
				e.reject(n);
			}
		})), e.promise;
	}
};
async function bv(e, t) {
	e.asyncQueue.verifyOperationInProgress(), F(vv, "Initializing OfflineComponentProvider");
	let n = e.configuration;
	await t.initialize(n);
	let r = n.initialUser;
	e.setCredentialChangeListener((async (e) => {
		r.isEqual(e) || (await T_(t.localStore, e), r = e);
	})), t.persistence.setDatabaseDeletedListener((() => e.terminate())), e._offlineComponents = t;
}
async function xv(e, t) {
	e.asyncQueue.verifyOperationInProgress();
	let n = await Sv(e);
	F(vv, "Initializing OnlineComponentProvider"), await t.initialize(n, e.configuration), e.setCredentialChangeListener(((e) => K_(t.remoteStore, e))), e.setAppCheckTokenChangeListener(((e, n) => K_(t.remoteStore, n))), e._onlineComponents = t;
}
async function Sv(e) {
	if (!e._offlineComponents) {
		if (e._uninitializedComponentsProvider) {
			F(vv, "Using user provided OfflineComponentProvider");
			try {
				await bv(e, e._uninitializedComponentsProvider._offline);
			} catch (t) {
				let n = t;
				if (!function(e) {
					return e.name === "FirebaseError" ? e.code === B.FAILED_PRECONDITION || e.code === B.UNIMPLEMENTED : !(typeof DOMException < "u" && e instanceof DOMException) || e.code === 22 || e.code === 20 || e.code === 11;
				}(n)) throw n;
				wc("Error using user provided cache. Falling back to memory cache: " + n), await bv(e, new hv());
			}
		} else F(vv, "Using default OfflineComponentProvider"), await bv(e, new gv(void 0));
	}
	return e._offlineComponents;
}
async function Cv(e) {
	return e._onlineComponents || (e._uninitializedComponentsProvider ? (F(vv, "Using user provided OnlineComponentProvider"), await xv(e, e._uninitializedComponentsProvider._online)) : (F(vv, "Using default OnlineComponentProvider"), await xv(e, new _v()))), e._onlineComponents;
}
function wv(e) {
	return Cv(e).then(((e) => e.syncEngine));
}
function Tv(e, t) {
	let n = new Df();
	return e.asyncQueue.enqueueAndForget((async () => ov(await wv(e), t, n))), n.promise;
}
var Ev = class {
	constructor(e, t, n, r, i) {
		this._firestore = e, this._userDataWriter = t, this._key = n, this._document = r, this._converter = i;
	}
	get id() {
		return this._key.path.lastSegment();
	}
	get ref() {
		return new Op(this._firestore, this._converter, this._key);
	}
	exists() {
		return this._document !== null;
	}
	data() {
		if (this._document) {
			if (this._converter) {
				let e = new Dv(this._firestore, this._userDataWriter, this._key, this._document, null);
				return this._converter.fromFirestore(e);
			}
			return this._userDataWriter.convertValue(this._document.data.value);
		}
	}
	_fieldsProto() {
		return this._document?.data.clone().value.mapValue.fields ?? void 0;
	}
	get(e) {
		if (this._document) {
			let t = this._document.data.field(Kp("DocumentSnapshot.get", e));
			if (t !== null) return this._userDataWriter.convertValue(t);
		}
	}
}, Dv = class extends Ev {
	data() {
		return super.data();
	}
};
function Ov(e, t, n) {
	let r;
	return r = e ? n && (n.merge || n.mergeFields) ? e.toFirestore(t, n) : e.toFirestore(t) : t, r;
}
var kv = "AsyncQueue", Av = class {
	constructor(e = Promise.resolve()) {
		this.$c = [], this.Kc = !1, this.Qc = [], this.Wc = null, this.Gc = !1, this.zc = !1, this.jc = [], this.Ht = new Xf(this, "async_queue_retry"), this.Hc = () => {
			let e = $_();
			e && F(kv, "Visibility state changed to " + e.visibilityState), this.Ht.$t();
		}, this.Jc = e;
		let t = $_();
		t && typeof t.addEventListener == "function" && t.addEventListener("visibilitychange", this.Hc);
	}
	get isShuttingDown() {
		return this.Kc;
	}
	enqueueAndForget(e) {
		this.enqueue(e);
	}
	enqueueAndForgetEvenWhileRestricted(e) {
		this.Yc(), this.Zc(e);
	}
	enterRestrictedMode(e) {
		if (!this.Kc) {
			this.Kc = !0, this.zc = e || !1;
			let t = $_();
			t && typeof t.removeEventListener == "function" && t.removeEventListener("visibilitychange", this.Hc);
		}
	}
	enqueue(e) {
		if (this.Yc(), this.Kc) return new Promise((() => {}));
		let t = new Df();
		return this.Zc((() => this.Kc && this.zc ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise))).then((() => t.promise));
	}
	enqueueRetryable(e) {
		this.enqueueAndForget((() => (this.$c.push(e), this.Xc())));
	}
	async Xc() {
		if (this.$c.length !== 0) {
			try {
				await this.$c[0](), this.$c.shift(), this.Ht.reset();
			} catch (e) {
				if (!mp(e)) throw e;
				F(kv, "Operation failed with retryable error: " + e);
			}
			this.$c.length > 0 && this.Ht.kt((() => this.Xc()));
		}
	}
	Zc(e) {
		let t = this.Jc.then((() => (this.Gc = !0, e().catch(((e) => {
			throw this.Wc = e, this.Gc = !1, Cc("INTERNAL UNHANDLED ERROR: ", jv(e)), e;
		})).then(((e) => (this.Gc = !1, e))))));
		return this.Jc = t, t;
	}
	enqueueAfterDelay(e, t, n) {
		this.Yc(), this.jc.indexOf(e) > -1 && (t = 0);
		let r = Y_.createAndSchedule(this, e, t, n, ((e) => this.el(e)));
		return this.Qc.push(r), r;
	}
	Yc() {
		this.Wc && I(47125, { tl: jv(this.Wc) });
	}
	verifyOperationInProgress() {}
	async nl() {
		let e;
		do
			e = this.Jc, await e;
		while (e !== this.Jc);
	}
	rl(e) {
		for (let t of this.Qc) if (t.timerId === e) return !0;
		return !1;
	}
	il(e) {
		return this.nl().then((() => {
			this.Qc.sort(((e, t) => e.targetTimeMs - t.targetTimeMs));
			for (let t of this.Qc) if (t.skipDelay(), e !== "all" && t.timerId === e) break;
			return this.nl();
		}));
	}
	sl(e) {
		this.jc.push(e);
	}
	el(e) {
		let t = this.Qc.indexOf(e);
		this.Qc.splice(t, 1);
	}
};
function jv(e) {
	let t = e.message || "";
	return e.stack && (t = e.stack.includes(e.message) ? e.stack : e.message + "\n" + e.stack), t;
}
var Mv = class extends Tp {
	constructor(e, t, n, r) {
		super(e, t, n, r), this.type = "firestore", this._queue = new Av(), this._persistenceKey = r?.name || "[DEFAULT]";
	}
	async _terminate() {
		if (this._firestoreClient) {
			let e = this._firestoreClient.terminate();
			this._queue = new Av(e), this._firestoreClient = void 0, await e;
		}
	}
};
function Nv(e, t) {
	let n = typeof e == "object" ? e : Qt(), r = typeof e == "string" ? e : t || _l, i = qt(n, "firestore").getImmediate({ identifier: r });
	if (!i._initialized) {
		let e = m("firestore");
		e && Ep(i, ...e);
	}
	return i;
}
function Pv(e) {
	if (e._terminated) throw new V(B.FAILED_PRECONDITION, "The client has already been terminated.");
	return e._firestoreClient || Fv(e), e._firestoreClient;
}
function Fv(e) {
	let t = e._freezeSettings(), n = ap(e._databaseId, e._app?.options.appId || "", e._persistenceKey, e._app?.options.apiKey, t);
	e._componentsProvider || t.localCache?._offlineComponentProvider && t.localCache?._onlineComponentProvider && (e._componentsProvider = {
		_offline: t.localCache._offlineComponentProvider,
		_online: t.localCache._onlineComponentProvider
	}), e._firestoreClient = new yv(e._authCredentials, e._appCheckCredentials, e._queue, n, e._componentsProvider && function(e) {
		let t = e?._online.build();
		return {
			_offline: e?._offline.build(t),
			_online: t
		};
	}(e._componentsProvider));
}
var Iv = class {
	constructor(e, t) {
		this.hasPendingWrites = e, this.fromCache = t;
	}
	isEqual(e) {
		return this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache;
	}
}, Lv = class e extends Ev {
	constructor(e, t, n, r, i, a) {
		super(e, t, n, r, a), this._firestore = e, this._firestoreImpl = e, this.metadata = i;
	}
	exists() {
		return super.exists();
	}
	data(e = {}) {
		if (this._document) {
			if (this._converter) {
				let t = new Rv(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
				return this._converter.fromFirestore(t, e);
			}
			return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps);
		}
	}
	get(e, t = {}) {
		if (this._document) {
			let n = this._document.data.field(Kp("DocumentSnapshot.get", e));
			if (n !== null) return this._userDataWriter.convertValue(n, t.serverTimestamps);
		}
	}
	toJSON() {
		if (this.metadata.hasPendingWrites) throw new V(B.FAILED_PRECONDITION, "DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
		let t = this._document, n = {};
		return n.type = e._jsonSchemaVersion, n.bundle = "", n.bundleSource = "DocumentSnapshot", n.bundleName = this._key.toString(), !t || !t.isValidDocument() || !t.isFoundDocument() ? n : (this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields, "previous"), n.bundle = (this._firestore, this.ref.path, "NOT SUPPORTED"), n);
	}
};
Lv._jsonSchemaVersion = "firestore/documentSnapshot/1.0", Lv._jsonSchema = {
	type: W("string", Lv._jsonSchemaVersion),
	bundleSource: W("string", "DocumentSnapshot"),
	bundleName: W("string"),
	bundle: W("string")
};
var Rv = class extends Lv {
	data(e = {}) {
		return super.data(e);
	}
}, zv = class e {
	constructor(e, t, n, r) {
		this._firestore = e, this._userDataWriter = t, this._snapshot = r, this.metadata = new Iv(r.hasPendingWrites, r.fromCache), this.query = n;
	}
	get docs() {
		let e = [];
		return this.forEach(((t) => e.push(t))), e;
	}
	get size() {
		return this._snapshot.docs.size;
	}
	get empty() {
		return this.size === 0;
	}
	forEach(e, t) {
		this._snapshot.docs.forEach(((n) => {
			e.call(t, new Rv(this._firestore, this._userDataWriter, n.key, n, new Iv(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
		}));
	}
	docChanges(e = {}) {
		let t = !!e.includeMetadataChanges;
		if (t && this._snapshot.excludesMetadataChanges) throw new V(B.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
		return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === t || (this._cachedChanges = function(e, t) {
			if (e._snapshot.oldDocs.isEmpty()) {
				let t = 0;
				return e._snapshot.docChanges.map(((n) => {
					Ng(e._snapshot.query) ? t_(e._snapshot.query) : e.query._query;
					let r = new Rv(e._firestore, e._userDataWriter, n.doc.key, n.doc, new Iv(e._snapshot.mutatedKeys.has(n.doc.key), e._snapshot.fromCache), e.query.converter);
					return n.doc, {
						type: "added",
						doc: r,
						oldIndex: -1,
						newIndex: t++
					};
				}));
			}
			{
				let n = e._snapshot.oldDocs;
				return e._snapshot.docChanges.filter(((e) => t || e.type !== 3)).map(((t) => {
					let r = new Rv(e._firestore, e._userDataWriter, t.doc.key, t.doc, new Iv(e._snapshot.mutatedKeys.has(t.doc.key), e._snapshot.fromCache), e.query.converter), i = -1, a = -1;
					return t.type !== 0 && (i = n.indexOf(t.doc.key), n = n.delete(t.doc.key)), t.type !== 1 && (n = n.add(t.doc), a = n.indexOf(t.doc.key)), {
						type: Bv(t.type),
						doc: r,
						oldIndex: i,
						newIndex: a
					};
				}));
			}
		}(this, t), this._cachedChangesIncludeMetadataChanges = t), this._cachedChanges;
	}
	toJSON() {
		if (this.metadata.hasPendingWrites) throw new V(B.FAILED_PRECONDITION, "QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
		let t = {};
		t.type = e._jsonSchemaVersion, t.bundleSource = "QuerySnapshot", t.bundleName = Oc.newId(), this._firestore._databaseId.database, this._firestore._databaseId.projectId;
		let n = [], r = [], i = [];
		return this.docs.forEach(((e) => {
			e._document !== null && (n.push(e._document), r.push(this._userDataWriter.convertObjectMap(e._document.data.value.mapValue.fields, "previous")), i.push(e.ref.path));
		})), t.bundle = (this._firestore, this.query._query, t.bundleName, "NOT SUPPORTED"), t;
	}
};
function Bv(e) {
	switch (e) {
		case 0: return "added";
		case 2:
		case 3: return "modified";
		case 1: return "removed";
		default: return I(61501, { type: e });
	}
}
zv._jsonSchemaVersion = "firestore/querySnapshot/1.0", zv._jsonSchema = {
	type: W("string", zv._jsonSchemaVersion),
	bundleSource: W("string", "QuerySnapshot"),
	bundleName: W("string"),
	bundle: W("string")
};
//#endregion
//#region node_modules/@firebase/firestore/dist/index.esm.js
function Vv(e, t, n) {
	e = el(e, Op);
	let r = el(e.firestore, Mv), i = Ov(e.converter, t, n);
	return Hv(r, [zp(Rp(r), "setDoc", e._key, i, e.converter !== null, n).toMutation(e._key, Cu.none())]);
}
function Hv(e, t) {
	return Tv(Pv(e), t);
}
var Uv = "@firebase/firestore", Wv = "4.17.2";
(function(e, t = !0) {
	bc(Xt), Kt(new De("firestore", ((e, { instanceIdentifier: n, options: r }) => {
		let i = e.getProvider("app").getImmediate(), a = new Mv(new jf(e.getProvider("auth-internal")), new Ff(i, e.getProvider("app-check-internal")), yl(i, n), i);
		return r = {
			useFetchStreams: t,
			...r
		}, a._setSettings(r), a;
	}), "PUBLIC").setMultipleInstances(!0)), en(Uv, Wv, e), en(Uv, Wv, "esm2020");
})();
//#endregion
export { Ap as collection, jp as doc, $t as getApps, Mo as getAuth, Nv as getFirestore, Zt as initializeApp, Ui as onAuthStateChanged, em as serverTimestamp, Vv as setDoc, Bi as signInWithEmailAndPassword, Wi as signOut };
