#version 330 core

// Rasterization generates fragments for the covered samples of the cube.
// This shader uses interpolated surface data to produce a colour for each fragment.

in vec3 worldPosition;
in vec3 vertexPos;
in float displacedMat;
in vec3 worldNormal;
in vec2 uv;

uniform float time;

// lightDirection points from the surface toward the directional light.
uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 viewPosition;
uniform vec3 baseColor;
uniform float ambientStrength;
uniform float specularStrength;
uniform float shininess;
uniform sampler2D surfaceTexture;

out vec4 FragColor; // The colour produced for this fragment.

void main()
{
    vec3 colorTint = vec3(0.114, 0.557, 0.922);
    float Brightness = 1.0;
    float Contrast = 0.3;

    vec4 texel = texture(surfaceTexture, uv);
    vec3 materialColor = texel.rgb * baseColor * colorTint * Brightness;
    materialColor = mix(colorTint, materialColor, Contrast);

    
    vec3 modifiedColor = materialColor;
    vec3 foam = vec3(0.8,0.8,0.8);
    modifiedColor = materialColor + (foam * (clamp(1.5 * vertexPos.y,0,1)));
    //modifiedColor = materialColor + (foam * (clamp(((displacedMat - 0.8) * 10),0,1)));


    // Interpolation can change a normal's length, so normalize per fragment.
    vec3 N = normalize(worldNormal);
    vec3 L = normalize(lightDirection);

    float diffuse = max(dot(N, L), 0.0);

    vec3 V = normalize(viewPosition - worldPosition);
    vec3 H = normalize(L + V);

    // Only a surface facing the light may receive a specular highlight.
    float specular = 0.0;
    if (diffuse > 0.0)
    {
        specular = pow(max(dot(N, H), 0.0), shininess);
    }

    vec3 ambientColor = ambientStrength * modifiedColor * lightColor;
    vec3 diffuseColor = diffuse * modifiedColor * lightColor;
    vec3 specularColor = specularStrength * specular * lightColor;

    vec3 color = ambientColor + diffuseColor + specularColor;
    FragColor = vec4(color, 1.0);

}
