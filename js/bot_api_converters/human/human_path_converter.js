'use strict';

import {Position} from '../../model/Position.js';
import {Path} from '../../model/Path.js';
import {HumanConverter} from './human_converter.js';

export class HumanPathConverter extends HumanConverter {

    
    /*
    API Doc:
        https://osbot.org/api/org/osbot/rs07/api/map/Position.html
        
        Position(int x, int y, int z)
    */
    fromJava(text, path) {
        path.removeAll();
        text = text.replace(/\s/g, '');
        var posPattern = `new${this.javaPosition}\\((\\d+,\\d+,\\d)\\)`;
        var re = new RegExp(posPattern, "mg");
        var match;
        while ((match = re.exec(text))) {
            var values = match[1].split(",");
            path.add(new Position(values[0], values[1], values[2]));
        }
    }
    
    toRaw(path) {
        var output = "";
        var lengthMan = 0;
        var lengthEuc = 0;
        var lengthEucT = 0;
        output += 'Length: ';
        for (var i = 0; i < path.positions.length -1; i++) {
            lengthMan += Math.abs(path.positions[i].x - path.positions[i+1].x);
            lengthMan += Math.abs(path.positions[i].y - path.positions[i+1].y);
        }

        for (var i = 0; i < path.positions.length -1; i++) {
            lengthEucT += Math.pow(path.positions[i].x - path.positions[i+1].x,2);
            lengthEucT += Math.pow(path.positions[i].y - path.positions[i+1].y,2);
            lengthEuc += Math.sqrt(lengthEucT);
            lengthEucT = 0;
        }
        
        output += lengthMan;

        output += ' LengthEuclid: ';
        output += (lengthEuc);

        output += '\n';
        output += 'TT man: ';
        output += Math.ceil(lengthMan/2) - 1;
        output += '\n';
        output += (lengthMan/2) - 1;
        output += '\n';
        output += 'TT Euc: ';
        output += Math.floor(lengthEuc/2);

        output += '\n';
        for (var i = 0; i < path.positions.length; i++) {
            output += `${path.positions[i].x},${path.positions[i].y},${path.positions[i].z}\n`;
        }
        return output;
    }
    
    toJavaSingle(position) {
        return `${this.javaPosition} position = new ${this.javaPosition}(${position.x}, ${position.y}, ${position.z});`;
    }
    
    toJavaArray(path) {
        if (path.positions.length == 1) {
            return this.toJavaSingle(path.positions[0]);
        } else if (path.positions.length > 1) {
            var output = `${this.javaPosition}[] path = {\n`;
            for (var i = 0; i < path.positions.length; i++) {
                output += `    new ${this.javaPosition}(${path.positions[i].x}, ${path.positions[i].y}, ${path.positions[i].z})`;
                if (i != path.positions.length - 1) output += ",";
                output += "\n";
            }
            output += "};";
            return output;
        }
        return "";
    }
    
    toJavaList(path) {
        if (path.positions.length == 1) {
            return this.toJavaSingle(path.positions[0]);
        } else if (path.positions.length > 1) {
            var output = `List&lt;${this.javaPosition}&gt; path = new ArrayList<>();\n`;
            for (var i = 0; i < path.positions.length; i++) {
                output += `path.add(new ${this.javaPosition}(${path.positions[i].x}, ${path.positions[i].y}, ${path.positions[i].z}));\n`;
            }
            return output;
        }
        return "";
    }
    
    toJavaArraysAsList(path) {
        if (path.positions.length == 1) {
            return this.toJavaSingle(path.positions[0]);
        } else if (path.positions.length > 1) {
            var output = `List&lt;${this.javaPosition}&gt; path = Arrays.asList(\n    new ${this.javaPosition}[]{\n`;
            for (var i = 0; i < path.positions.length; i++) {
                output += `        new ${this.javaPosition}(${path.positions[i].x}, ${path.positions[i].y}, ${path.positions[i].z})`;
                if (i != path.positions.length - 1) output += ",";
                output += "\n";
            }
            output += "    }\n);";
            return output;
        }
        return "";
    }
}
