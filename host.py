import http.server
import ssl
import socket
import os

HOST = "0.0.0.0"
PORT = 443

# Project folder:
# C:\Users\Mateo Ognenovski\Downloads\CSSFontFace-Exploit-main\CSSFontFace-Exploit-main

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# Website is inside public\
WEB_ROOT = os.path.join(PROJECT_ROOT, "public")

# Certificate is next to host.py
CERT_FILE = os.path.join(PROJECT_ROOT, "localhost.pem")


# Check website folder
if not os.path.isdir(WEB_ROOT):
    print("ERROR: public folder not found:")
    print(WEB_ROOT)
    raise SystemExit(1)


# Check index.html
INDEX_FILE = os.path.join(WEB_ROOT, "index.html")

if not os.path.isfile(INDEX_FILE):
    print("ERROR: index.html not found:")
    print(INDEX_FILE)
    raise SystemExit(1)


# Check certificate
if not os.path.isfile(CERT_FILE):
    print("ERROR: localhost.pem not found:")
    print(CERT_FILE)
    raise SystemExit(1)


# Serve files from public\
os.chdir(WEB_ROOT)


def get_local_ip():
    sock = socket.socket(
        socket.AF_INET,
        socket.SOCK_DGRAM
    )

    try:
        sock.connect(("8.8.8.8", 80))
        return sock.getsockname()[0]

    except Exception:
        return "127.0.0.1"

    finally:
        sock.close()


LOCAL_IP = get_local_ip()


class Handler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):

        # Homepage
        if self.path == "/":
            self.path = "/index.html"

        # Server information
        elif self.path == "/api/server-info":

            response = (
                '{"ip":"' + LOCAL_IP +
                '","url":"https://' + LOCAL_IP + '"}'
            ).encode("utf-8")

            self.send_response(200)

            self.send_header(
                "Content-Type",
                "application/json"
            )

            self.send_header(
                "Content-Length",
                str(len(response))
            )

            self.send_header(
                "Cache-Control",
                "no-store"
            )

            self.end_headers()

            self.wfile.write(response)

            return

        return super().do_GET()


# Create HTTPS context
context = ssl.SSLContext(
    ssl.PROTOCOL_TLS_SERVER
)


# Load localhost.pem
context.load_cert_chain(
    CERT_FILE
)


# Create HTTPS server
httpd = http.server.HTTPServer(
    (HOST, PORT),
    Handler
)


# Wrap server with SSL
httpd.socket = context.wrap_socket(
    httpd.socket,
    server_side=True
)


print()
print("==============================================")
print("             SCOOBERT WEB SERVER")
print("==============================================")
print()

print("Website:")
print(WEB_ROOT)

print()

print("Certificate:")
print(CERT_FILE)

print()

print("Local IP:")
print(f"https://{LOCAL_IP}/")

print()

print("index.html: FOUND")
print("localhost.pem: FOUND")

print()
print("==============================================")
print()


httpd.serve_forever()