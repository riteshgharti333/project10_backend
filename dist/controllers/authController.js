"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.getProfile = exports.updatePassword = exports.login = exports.register = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../utils/catchAsync");
const authService = __importStar(require("../services/authService"));
const register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await authService.registerUser(name, email, password);
    res.status(http_status_1.default.CREATED).send({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
});
exports.register = register;
const login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginWithEmailAndPassword(email, password);
    const tokens = await authService.generateAuthTokens(user);
    res.send({ user, tokens });
});
exports.login = login;
const updatePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    await authService.updatePassword(userId, currentPassword, newPassword);
    res.status(http_status_1.default.NO_CONTENT).send();
});
exports.updatePassword = updatePassword;
const getProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await authService.getUserProfile(req.user.id);
    res.send(user);
});
exports.getProfile = getProfile;
const verifyEmail = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { token } = req.query;
    await authService.verifyEmail(token);
    res.status(http_status_1.default.NO_CONTENT).send();
});
exports.verifyEmail = verifyEmail;
const forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(http_status_1.default.NO_CONTENT).send();
});
exports.forgotPassword = forgotPassword;
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.status(http_status_1.default.NO_CONTENT).send();
});
exports.resetPassword = resetPassword;
