package gary.backend.Helper;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;

public class KeyGenerator {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        KeyPair pair = generator.generateKeyPair();

        String pub = Base64.getEncoder().encodeToString(pair.getPublic().getEncoded());
        String priv = Base64.getEncoder().encodeToString(pair.getPrivate().getEncoded());

        System.out.println("----- PUBLIC KEY -----");
        System.out.println(pub);
        System.out.println("----- PRIVATE KEY -----");
        System.out.println(priv);
    }
}