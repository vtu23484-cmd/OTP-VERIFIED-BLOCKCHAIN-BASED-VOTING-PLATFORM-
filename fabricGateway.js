const grpc = require('@grpc/grpc-js');
const { connect, hash, signers } = require('@hyperledger/fabric-gateway');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const channelName = 'mychannel';
const chaincodeName = 'voting';
const mspId = 'Org1MSP';
const peerEndpoint = 'localhost:7051';
const cryptoPath = path.resolve(__dirname, '../crypto');

let gateway;

async function getGateway() {
    if (gateway) {
        return gateway;
    }

    try {
        // Check if crypto files exist
        const certPath = path.join(cryptoPath, 'msp', 'signcerts', 'cert.pem');
        const keyPath = path.join(cryptoPath, 'msp', 'keystore', 'priv_sk');
        const tlsCertPath = path.join(cryptoPath, 'tls', 'ca.crt');

        const cert = await fs.readFile(certPath, 'utf8');
        const key = await fs.readFile(keyPath, 'utf8');
        const tlsRootCert = await fs.readFile(tlsCertPath, 'utf8');

        const client = new grpc.Client(
            peerEndpoint,
            grpc.credentials.createSsl(Buffer.from(tlsRootCert))
        );

        const privateKey = crypto.createPrivateKey(key);
        const signer = signers.newPrivateKeySigner(privateKey);

        gateway = connect({
            client,
            identity: {
                mspId,
                credentials: Buffer.from(cert)
            },
            signer,
            hash: hash.sha256
        });

        console.log('✅ Connected to Fabric gateway');
        return gateway;
    } catch (error) {
        console.error('❌ Gateway connection error:', error.message);
        throw error;
    }
}

async function getContract() {
    const gateway = await getGateway();
    const network = gateway.getNetwork(channelName);
    return network.getContract(chaincodeName);
}

module.exports = { getContract, getGateway };
