<template>
    <div class="login-container">
        <h2 class="sotheby-font">QQ Login</h2>
        <div class="login-methods">
            <t-button
                id="quick-login"
                class="login-method"
                :class="{ active: loginMethod === 'quick' }"
                @click="loginMethod = 'quick'"
                >Quick Login</t-button
            >
            <t-button
                id="qrcode-login"
                class="login-method"
                :class="{ active: loginMethod === 'qrcode' }"
                @click="loginMethod = 'qrcode'"
                >QR Code</t-button
            >
        </div>
        <div v-show="loginMethod === 'quick'" id="quick-login-dropdown" class="login-form">
            <t-select
                id="quick-login-select"
                v-model="selectedAccount"
                placeholder="Select Account"
                @change="selectAccount"
            >
                <t-option v-for="account in quickLoginList" :key="account" :value="account">{{ account }}</t-option>
            </t-select>
        </div>
        <div v-show="loginMethod === 'qrcode'" id="qrcode" class="qrcode">
            <canvas ref="qrcodeCanvas"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as QRCode from 'qrcode';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { QQLoginManager } from '@/backend/shell';

const router = useRouter();
const loginMethod = ref<'quick' | 'qrcode'>('quick');
const quickLoginList = ref<string[]>([]);
const selectedAccount = ref<string>('');
const qrcodeCanvas = ref<HTMLCanvasElement | null>(null);
const qqLoginManager = new QQLoginManager(localStorage.getItem('auth') || '');
let heartBeatTimer: number | null = null;

const selectAccount = async (accountName: string): Promise<void> => {
    const { result, errMsg } = await qqLoginManager.setQuickLogin(accountName);
    if (result) {
        await MessagePlugin.success('登录成功即将跳转');
        await router.push({ path: '/dashboard/basic-info' });
    } else {
        await MessagePlugin.error('登录失败,' + errMsg);
    }
};

const generateQrCode = (data: string, canvas: HTMLCanvasElement | null): void => {
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    QRCode.toCanvas(canvas, data, function (error: Error | null | undefined) {
        if (error) {
            console.error('Error generating QR Code:', error);
        } else {
            console.log('QR Code generated!');
        }
    });
};

const HeartBeat = async (): Promise<void> => {
    const isLogined = await qqLoginManager.checkQQLoginStatus();
    if (isLogined) {
        if (heartBeatTimer) {
            clearInterval(heartBeatTimer);
        }
        await router.push({ path: '/dashboard/basic-info' });
    }
};

const InitPages = async (): Promise<void> => {
    quickLoginList.value = await qqLoginManager.getQQQuickLoginList();
    const qrcodeData = await qqLoginManager.getQQLoginQrcode();
    generateQrCode(qrcodeData, qrcodeCanvas.value);
    heartBeatTimer = window.setInterval(HeartBeat, 3000);
};

onMounted(() => {
    InitPages();
});
</script>

<style scoped>
.login-container {
    padding: 20px;
    border-radius: 5px;
    background-color: white;
    max-width: 400px;
    min-width: 300px;
    position: relative;
    margin: 0 auto;
}

@media (max-width: 600px) {
    .login-container {
        width: 90%;
        min-width: unset;
    }
}

.login-methods {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.login-method {
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
}

.login-method.active {
    background-color: #e6f0ff;
    color: #007bff;
}

.login-form,
.qrcode {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.qrcode {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    text-align: center;
}

.sotheby-font {
    font-family: Sotheby, Helvetica, monospace;
    font-size: 3.125rem;
    line-height: 1.2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.footer {
    text-align: center;
    margin: 0;
    font-size: 0.875rem;
    color: #888;
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    width: 100%;
    background-color: white;
}
</style>
