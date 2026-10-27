import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {OTPInput as Before} from './otpBefore/input';
import {OTPInput as After} from './otpAfter/input';

function Case({patched}: {patched: boolean}) {
  const Input = patched ? After : Before;
  const [height, setHeight] = useState(0);
  const [inputHeight, setInputHeight] = useState(0);
  const [code, setCode] = useState('none');
  return <View style={s.card}>
    <Text style={s.heading}>{patched ? 'AFTER' : 'BEFORE'}</Text>
    <View style={s.outline} onLayout={e => setHeight(e.nativeEvent.layout.height)}>
      <Input maxLength={4} clearTextOnFocus={false}
        onLayout={e => setInputHeight(e.nativeEvent.layout.height)}
        onComplete={setCode}
        render={({slots}) => <View style={s.slots}>{slots.map((slot, i) =>
          <View key={i} style={s.slot}><Text style={s.digit}>{slot.char || '-'}</Text></View>
        )}</View>}
      />
    </View>
    <View style={s.marker}><Text style={s.markerText}>Next content starts here</Text></View>
    <Text style={s.metric}>Slot row: 48 dp | OTP container: {height.toFixed(1)} dp</Text>
    <Text style={s.metric}>Hidden native input: {inputHeight.toFixed(1)} dp</Text>
    <Text style={s.metric}>Completed code: {code}</Text>
  </View>;
}
export default function App() {
  return <ScrollView style={s.page} contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
    <Text style={s.title}>OTP hidden input layout</Text>
    <Text style={s.subtitle}>RN 0.87.1 / Android API 35 / Fabric</Text>
    <Text style={s.subtitle}>Same APK, original vs patched source</Text>
    <Case patched={false}/><Case patched/>
  </ScrollView>;
}
const s = StyleSheet.create({
  page:{flex:1,backgroundColor:'#101827'},body:{padding:20,paddingTop:52,paddingBottom:40},
  title:{fontSize:24,fontWeight:'700',color:'white'},subtitle:{fontSize:13,color:'#b4c4d8',marginTop:6},
  card:{backgroundColor:'#1c2a3e',padding:14,borderRadius:12,marginTop:22},
  heading:{color:'white',fontSize:17,fontWeight:'700',marginBottom:14},
  outline:{backgroundColor:'#7b3b48'},slots:{flexDirection:'row',height:48,gap:10},
  slot:{width:52,height:48,borderWidth:1,borderColor:'#93a9c8',backgroundColor:'#253b54',alignItems:'center',justifyContent:'center'},
  digit:{color:'white',fontSize:22},marker:{backgroundColor:'#4bd0a4',padding:5},markerText:{color:'#112d25',fontSize:12},
  metric:{fontSize:12,color:'#d7e4f4',marginTop:9},
});
